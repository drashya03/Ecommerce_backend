import Cart from "../models/Cart.js";
import Product from "../models/Product.js";


export const addToCart = async (req,res)=>{
    try {
        const userId = req.user.id;
        const { productId, quantity } = req.body;

        // find if product exists or not
        const product = await Product.findById(productId);
        if(!product){
            return res.json({message: "product not found"});
        }
        let cart = await Cart.findOne({userId});

        // No cart,then create one
        if(!cart){
            cart = await Cart.create({
                userId,
                items: [{productId, quantity}]
            });
            return res.json({message: "Item added to cart",cart})
        }


        // Check if product already exist in cart
        const itemIndex = cart.items.findIndex(
            (item)=> item.productId.toString() === productId.toString()
        );

        if(itemIndex > -1){
            cart.items[itemIndex].quantity +=quantity;
        }else{
            cart.items.push({productId, quantity});
        }

        await cart.save();
        res.json({message: "Cart updated", cart});



    } catch (error) {
        res.error(error.message)
    }
}

export const removeFromCart = async(req, res) => {
    try {
        console.log("hello")

        const userId = req.user.id;
        const {productId} = req.body

        let cart = await Cart.findOne({userId});
        if(!cart) return res.status(404).json({message:"cart not found"});

        cart.items = cart.items.filter(
            item => item.productId.toString() !== productId
        )
        await cart.save();
        res.json({message: "item removed successfully"});
        
    } catch (error) {
        res.json(error.message);
    }
}

export const getCatItems = async(req,res) => {
        try {
            const userId = req.user.id;
            const cart = await Cart.findOne({ userId })
            .populate("items.productId", "title price imageURL")

            if(!cart){
                return res.json({items:[]});
            }

            res.json({cart});


        } catch (error) {
            res.json({ message: "Server error", error: error.message });
        }
}