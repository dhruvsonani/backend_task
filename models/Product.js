const { Schema, default: mongoose } = require("mongoose");

const ProductSchema = new Schema({
    id: Number,
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
    sold: Boolean,
    dateOfSale: Date
});

const Product = mongoose.model('Product',ProductSchema)

module.exports = Product;