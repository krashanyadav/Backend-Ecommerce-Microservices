const express = require("express");
const { createProduct, getallProduct, getSingalProduct, updateProduct, deleteProduct, getfind, getProductById } = require("../controllers/productContoller.js");
const authenticate = require("../middlewares/tokenBassedAuthent.js");
const authorizeRole = require("../middlewares/authorizeRole.js");
const upload = require("../middlewares/multer.js"); // apni multer file
const productValidation = require("../middlewares/inpValidation.js");

const productRoute = express.Router();

productRoute.post(
    "/create",
    authenticate,
    authorizeRole("admin"),
    upload.array("images", 4),
    productValidation,
    createProduct
);

productRoute.get("/getall",getallProduct)
productRoute.get("/getsingle/:slug",getSingalProduct)
productRoute.put("/update/:id",authenticate,authorizeRole("admin"),upload.array("images",4),updateProduct)
productRoute.delete("/delete/:id",authenticate,authorizeRole("admin"),deleteProduct)


productRoute.get("/getfind",getfind) //use qurey for search

//...............for cart-service............
productRoute.get("/getById/:id",getProductById)



module.exports = productRoute;