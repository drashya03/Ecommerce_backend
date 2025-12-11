import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

// req.user.id {value comes from tokes}
// req.params.id {vlaue comes from url }

export const checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    //  console.log(userId)
    // get cart from db
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    // console.log(cart)
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "cart is empty" });
    }

    // calculate total amount
    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
      const price = item.productId.price;
      totalAmount += price * item.quantity;

      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price,
      };
    });

    // 3. Create Stripe Payment Intent
    // const paymentIntent = await stripe.paymentIntents.create({
    //     amount: totalAmount * 100,   // in paise
    //     currency: "inr",
    //     payment_method_types: ["card"]
    // });

    // create order in db (status penidng)

    const order = await Order.create({
      userId,
      items: orderItems,
      amount: totalAmount,
      status: "pending",
      //   paymentId: paymentIntent.id,
    });

    // Clear user cart
    cart.items = [];
    await cart.save();

    // 6. Send payment secret to frontend
    res.json({
      message: "Order created & payment initiated",
      //   clientSecret: paymentIntent.client_secret,
      orderId: order._id,
      amount: totalAmount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    // find all orders
    const orders = await Order.find({ userId })
      .populate("items.productId", "title price imageURL")
      .sort({ createdAt: -1 });

    if (orders.length === 0) {
      return res.json({
        message: "No orders found",
        orders: [],
      });
    }

    res.json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const order = await Order.findById(orderId).populate(
      "items.productId",
      "title price imageURL"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    //Ensure logged-in user is the owner of this order
    if (order.userId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized: You cannot view this order" });
    }

    res.json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const UpdateOrderStatus = async (req, res) => {
  try {
    // role from JWT
    const userRole = req.user.role;
    const orderId = req.params.id;
    const { status } = req.body;

    // only admin
    if (userRole !== "admin") {
      return res.status(403).json({ message: "Only admin can update" });
    }

    // valid statuses
    const allowedStatus = [
      "pending",
      "shipped",
      "paid",
      "delovered",
      "cancelled",
    ];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // find order
    const order = Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    // update status
    order.status = status;
    await order.save();

    res.json({
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user.id;          // logged-in user
    const orderId = req.params.id;       // order to cancel

    // 1. Find the order
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 2. Check if the logged-in user owns this order
    if (order.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized: You cannot cancel this order" });
    }

    // 3. Check if order is cancellable
    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({
        message: `Cannot cancel order because it is already ${order.status}`
      });
    }

    // 4. OPTIONAL: Handle refund (if needed)
    // if (order.status === "paid") {
    //   await stripe.refunds.create({
    //     payment_intent: order.paymentId,
    //   });
    // }

    // 5. Change status to cancelled
    order.status = "cancelled";
    await order.save();

    // 6. OPTIONAL: Restore stock (recommended)
    // for (const item of order.items) {
    //   await Product.findByIdAndUpdate(item.productId, {
    //     $inc: { stock: item.quantity }
    //   });
    // }

    res.json({
      message: "Order cancelled successfully",
      order
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

