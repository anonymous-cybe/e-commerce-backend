//PRODUCT MODEL
const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema({
    name: { type: String },
    image: { type: String },
    price: { type: Number },
    categoryId: { type: String }


});

const Product = mongoose.model("Product", ProductSchema);

module.exports = Product;