const express = require("express");
const bcryptjs = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// app.................
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/uploads", express.static("uploads"));
// connect DB.............
require("./db/connection");
const Users = require("./moduls/Users");
const Products = require("./moduls/Products");
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.end("Ecommerce");
});

// register..........................
app.post("/api/register", async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      res.status(200).send("Plese all require files");
    } else {
      const isAlreadyExist = await Users.findOne({ email });
      if (isAlreadyExist) {
        res.status(400).send("User alredy Exist");
      } else {
        const newUser = new Users({ fullName, email });
        bcryptjs.hash(password, 10, (err, hashedPassword) => {
          newUser.set("password", hashedPassword);
          newUser.save();
          next();
        });
        return res.status(200).send("user register Successfully");
      }
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

// login...................................
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send("Plese all require files");
    } else {
      const user = await Users.findOne({ email });
      if (!user) {
        res.status(400).send("User Email & Password is Incorrect");
      } else {
        const valideteUser = await bcryptjs.compare(password, user.password);
        if (!valideteUser) {
          res.status(400).send("User Email & Password is Incorrect");
        } else {
          const payload = {
            userId: user._id,
            email: user.email,
          };
          const JWT_SECRET_KEY =
            process.env.JWT_SECRET_KEY || "THIS_IS_A_JWT_SECRET_KEY";
          jwt.sign(
            payload,
            JWT_SECRET_KEY,
            { expiresIn: 86400 },
            async (err, token) => {
              await Users.updateOne({ _id: user._id }, { $set: { token } });
              user.save();
              res.status(200).json({
                user: {
                  id: user._id,
                  email: user.email,
                  password: user.password,
                  fullName: user.fullName,
                },
                token: token,
              });
            }
          );
        }
      }
    }
  } catch (error) {
    console.log(error, "Error");
  }
});

// product register...................
app.post("/api/productregister", upload.single("image"), async (req, res) => {
  console.log("Request POST", req.file, req.body);
  try {
    const image = req.file.path;
    const { name, price, offer, stars, review, category, sale } = req.body;
    const newProduct = new Products({
      image,
      name,
      price,
      offer,
      stars,
      review,
      category,
      sale,
    });
    await newProduct.save();
    return res.status(200).send("Product registered successfully");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
// product GET.............................
app.get("/api/productregister", async (req, res) => {
  try {
    const productId = req.params.productId;
    const products = await Products.find();
    const productData = Promise.all(
      products.map(async (product) => {
        return {
          product: {
            id: product._id,
            image: product.image,
            name: product.name,
            price: product.price,
            offer: product.offer,
            stars: product.stars,
            review: product.review,
            category: product.category,
            sale: product.sale,
          },
        };
      })
    );
    res.status(200).send(await productData);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});
// app.get("/api/productregister", async (req, res) => {
//   try {
//     const productId = req.params.productId;
//     const products = await Products.find();
//     const productData = Promise.all(
//       products.map(async (product) => {
//         return {
//           product: {
//             image: product.image,
//             name: product.name,
//             peice: product.peice,
//             offer: product.offer,
//             stars: product.stars,
//             review: product.review,
//             category: product.category,
//             sale: product.sale,
//           },
//         };
//       })
//     );
//     res.status(200).send(await productData);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Internal Server Error");
//   }
// });

app.listen(port, () => {
  console.log("listing on Port" + port);
});
