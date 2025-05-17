import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";
import orderModel from "../models/orderModel.js";
import fs from "fs";
import slugify from "slugify";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import crypto from "crypto";

dotenv.config();

// Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// CREATE PRODUCT
export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "Photo should be less than 1MB" });
    }

    const product = new productModel({ ...req.fields, slug: slugify(name) });

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res
      .status(201)
      .send({ success: true, message: "Product Created", product });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error in creating product", error });
  }
};

// GET ALL PRODUCTS
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error getting products", error });
  }
};

// SINGLE PRODUCT
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");

    res.status(200).send({ success: true, message: "Single Product", product });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error getting product", error });
  }
};

// PRODUCT PHOTO
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (!product || !product.photo?.data) {
      return res
        .status(404)
        .send({ success: false, message: "Photo not found" });
    }
    res.set("Content-type", product.photo.contentType);
    res.status(200).send(product.photo.data);
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error getting photo", error });
  }
};

// DELETE PRODUCT
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({ success: true, message: "Product Deleted" });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error deleting product", error });
  }
};

// UPDATE PRODUCT
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res.status(500).send({ error: "Photo should be less than 1MB" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res
      .status(200)
      .send({ success: true, message: "Product Updated", product });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Error updating product", error });
  }
};

// FILTER PRODUCTS
export const productFiltersController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };

    const products = await productModel.find(args).select("-photo");
    res.status(200).send({ success: true, products });
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: "Error filtering products", error });
  }
};

// PRODUCT COUNT
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({ success: true, total });
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: "Error in product count", error });
  }
};

// PRODUCT LIST PAGINATION
export const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page || 1;

    const products = await productModel
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    res.status(200).send({ success: true, products });
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: "Error in pagination", error });
  }
};

// SEARCH PRODUCT
export const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = await productModel
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");

    res.json(results);
  } catch (error) {
    res
      .status(400)
      .send({ success: false, message: "Error searching products", error });
  }
};

// RELATED PRODUCTS
export const realtedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const products = await productModel
      .find({ category: cid, _id: { $ne: pid } })
      .select("-photo")
      .limit(3)
      .populate("category");

    res.status(200).send({ success: true, products });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error getting related products",
      error,
    });
  }
};

// PRODUCTS BY CATEGORY
export const productCategoryController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");

    res.status(200).send({ success: true, category, products });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: "Error getting category products",
      error,
    });
  }
};

// CASH ON DELIVERY ORDER
export const codOrderController = async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const products = cart.map((item) => ({
      product: item._id,
      quantity: item.quantity || 1,
    }));

    const order = new orderModel({
      products,
      payment: {
        success: true,
        mode: "COD",
        transaction: {},
      },
      buyer: req.user._id,
    });

    await order.save();

    res.status(201).json({ success: true, message: "COD order placed", order });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "COD order failed", error });
  }
};

// RAZORPAY ORDER CREATION
export const razorpayPaymentController = async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || cart.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let totalAmount = 0;
    cart.forEach((item) => {
      totalAmount += item.price * (item.quantity || 1);
    });

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      message: "Razorpay order created",
      order,
    });
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({
      success: false,
      message: "Razorpay order creation failed",
      error: error.message,
    });
  }
};
// Payment verification razorpay
export const razorpayVerifyController = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, cart } =
      req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    const isAuthentic = generated_signature === razorpay_signature;

    if (!isAuthentic) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    const products = cart.map((item) => ({
      product: item._id,
      quantity: item.quantity || 1,
    }));

    const order = new orderModel({
      products,
      payment: {
        success: true,
        mode: "Online",
        transaction: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
        },
      },
      buyer: req.user._id, // ✅ Secure & consistent
    });

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Payment verified & order placed",
      order,
    });
  } catch (error) {
    console.error("Verification Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
