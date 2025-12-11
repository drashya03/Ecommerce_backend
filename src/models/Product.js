import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageURL: { type: String, required: true },
  stock: { type: Number, required: true },
  category: { type: String, required: false}
});


const Product = mongoose.model("Product", productSchema);

 export default Product;