import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            quantity: Number,
            price: Number
        }
    ],
    amount: Number,
    status: {
        type: String,
        enum: ["pending", "paid", "cancelled"],
        default: "pending"
    },
    paymentId: String
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
