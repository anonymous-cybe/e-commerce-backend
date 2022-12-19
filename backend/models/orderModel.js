//ORDER MODEL
const mongoose = require("mongoose");
const OrderSchema = new mongoose.Schema({
    address: { type: String },
    city: { type: String },
    state: { type: Number },
    number: { type: String }


});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;