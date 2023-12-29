const mongoose = require("mongoose");

const productScgeme = mongoose.Schema({
  image: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  stars: {
    type: Number,
    require: true,
  },
  offer: {
    type: Number,
    require: true,
  },
  review: {
    type: Number,
    require: true,
  },
  category: {
    type: String,
    require: true,
  },
  sale: {
    type: String,
    require: true,
  },
  token: {
    type: String,
  },
});

const Products = mongoose.model("Products", productScgeme);

module.exports = Products;
