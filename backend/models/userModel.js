//USER MODEL
const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
    email:{type: String},
    username:{type: String},
    password:{type: String},
    isAdmin:{type: Boolean, default : false}


});

const User = mongoose.model("User", UserSchema);

module.exports = User;
