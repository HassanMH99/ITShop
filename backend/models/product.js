const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [100, "Product can also have 100 character"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    maxLength: [5, "Product can also have 5 character"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Select Category of product"],
    enum: {
      values: [
        "Electronics",
        "Cameras",
        "Laptops",
        "Headphones",
        "Accessories",
        "Cases",
        "iphone",
        "Screen",
      ],
      massage: "Please select the correct category for your product",
    },
  },
  seller: {
    type: String,
    required: [true, "Please enter Seller name"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter Product stock"],
    maxLength: [5, "Product cannot exceed 5 characters"],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt:{
    type:Date,
    default:Date.now()
  }
});

module.exports = mongoose.model("Product", productSchema);
