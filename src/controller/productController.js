import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, imageURL, stock, category } = req.body;

    const newProduct = await Product.create({
      title,
      description,
      price,
      imageURL,
      stock,
      category,
    });

    res.status(201).json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    res.json(error.message);
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.body;
    let query = {};

    // filter by category
    if (category) query.category = category;
    // search by title
    if (search) query.title = { $regex: search, $options: "i" };

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Product.countDocuments(query);

    res.json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      products,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const updateProduct = await Product.findByIdAndUpdate(productId, req.body, {
      new: true,
    });

    if (!updateProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product updated successfully",
      product: updateProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const deleteProductById = async (req, res) => {
  try {
   
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
