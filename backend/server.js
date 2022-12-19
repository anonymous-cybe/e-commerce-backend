const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/userModel");
const Product = require("./models/productsModel");
const Category = require("./models/categoryModel");
const Order = require("./models/orderModel");
const path = require("path");





const app = express();
app.use(express.json());
app.use(cors());
//saving the order in the backend

app.post("/api/order", async function (req, res) {
    console.log("req.body", req.body)
    const newOrder = new Order({
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        number: req.body.number
    })
    await newOrder.save();
    console.log("order saved");


})

//PRODUCTS ROUTES



//ADD APRODUCT
app.post("/products", async function (req, res) {

    const newProduct = new Product({
        name: req.body.name,
        image: req.body.image,
        price: req.body.price,
        categoryId: req.body.category
    })

    await newProduct.save();

    console.log("Product Saved Successfully");
})


//ADD A CATEGORY
app.post("/categories", async function (req, res) {
    const existingCategory = await Category.findOne({ name: req.body.name });
    if (existingCategory) {
        res.send({ message: "Category already exists" })
        return;
    }

    const newCategory = new Category({
        name: req.body.name,

    });

    await newCategory.save();
    res.send({ success: "Category Saved" })
    console.log("Category Saved Successfully");
})

//GET ALL PRODUCTS
app.get("/products", async function (req, res) {
    const name = req.query.name || "";
    const nameFilter = { name: { $regex: name, $options: 'i' } };
    const products = await Product.find({ ...nameFilter });
    res.send(products)



})

//GET ALL CATEGORIES
app.get("/categories", async function (req, res) {
    console.log("hit");
    const categories = await Category.find();
    console.log(categories);


    res.send(categories);



});


//DELETE A PRODUCT
//     /:id = req.params
app.delete("/products/:id", async function (req, res) {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    await product.deleteOne();
    console.log("Product deleted successfully");
})

//DELETE A CATEGORY
app.delete("/categories/:id", async function (req, res) {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    await category.deleteOne();
    console.log("Category deleted successfully");
})

//GET A SINGLE PRODUCT
app.get("/products/:id", async function (req, res) {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        res.send(product);
    } else {
        console.log("Product was not found")
    }
}
)
//GET A SINGLE CATEGORY
app.get("/products/:id", async function (req, res) {
    const categoryId = req.params.id;
    const category = await category.findById(categoryId);
    if (category) {
        res.send(category);
    } else {
        console.log("category was not found")
    }
}
)

//GET SUMMARY

app.get("/summary", async (req, res) => {
    const products = await Product.countDocuments();
    const users = await User.countDocuments();


    res.send({ products, users })
    console.log({ products, users });
})

//UPDATE A SINGLE PRODUCT
app.put("/products/:id", async function (req, res) {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
        product.name = req.body.name;
        product.image = req.body.image;
        product.price = req.body.price;
        await product.save();

    } else {
        console.log("Product was not found")
    }
}
)

app.post("/users/register", async function (req, res) {
    // console.log("Hit the register route on the backend")
    // console.log("req.body", req.body);

    const existingUser = await User.findOne({ email: req.body.email })
    if (existingUser) {
        console.log(" This email has already been used")
        res.send({ error: "This email has already been used" });
        return;
    }
    //register
    const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        isAdmin: true

    });
    await newUser.save();
    console.log("user saved successfully")
    res.send({ success: "User saved successfully" })


}
)

//UPDATE A SINGLE CATEGORY





//LOGIN
app.post("/users/login", async function (req, res) {
    const existingUser = await User.findOne({ email: req.body.email });
    //if user does not exist stop the code and send the error message below
    if (!existingUser) {
        res.send({ error: "User does not exist" });
        console.log({ error: "User does not exist" });

        return;
    }
    // if the user exists but his password is not equal to the req.body.password stop the code and display the message below
    if (existingUser.password !== req.body.password) {
        res.send({ error: "password is incorrect" });
        console.log({ error: "password is incorrect" });
        return;
    }
    res.send({ user: existingUser });
    console.log({ user: existingUser })
})
//GET ALL PRODUCTS IN A CATEGORY
app.get("/category-products/:id", async (req, res) => {
    const products = await Product.find({ categoryId: req.params.id })
    res.send(products);
})
// UPDATE USER ACCOUNT
// app.get("/users/:id", async (req, res)=>{
//     const userId = req.params.id;
//     const user = await User.findById(userId);
//     if(!user){
//         console.log("User Not Found");
//         return
//     }

//     console.log(user)
//     res.send(user);
// })



app.put("/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);

    user.username = req.body.username || user.username;
    user.Password = req.body.password || user.password;
    const updatedUser = await user.save();
    res.send(updatedUser);
})


app.get("/users", async (req, res) => {
    const users = await User.find();
    res.send(users);
})




// const mongoDBurl = "mongodb://127.0.0.1:27017/ecommerce"
const mongoDBurl = "mongodb+srv://SIFU:Paperbag20@sifu.cllqv8v.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(mongoDBurl)
    .then(result => console.log("MongoDB connected"))
    .catch(err => console.log(err))

const __dirnames = path.resolve();
app.use(express.static(path.join(__dirname, '/../frontend/build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(`${__dirname}/../frontend/build/index.html`));
})

app.listen(process.env.PORT || 5000, () => {
    console.log("App is running on port 5000")
});