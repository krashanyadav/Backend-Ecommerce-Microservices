const getProductById = require("../helper/productCon.js");
const Cart = require("../models/cart.js");


// ==============================
// Add To Cart
// ==============================
const addToCart = async (req, res) => {
    try {

        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product Id is required"
            });
        }
        // console.log(productId)

        const qty = Number(quantity) || 1;

        if (qty <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0"
            });
        }

        const product = await getProductById(productId);


        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (!product.isActive) {
            return res.status(400).json({
                success: false,
                message: "Product is inactive"
            });
        }
        

        if (qty > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            });
        }

        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {

            cart = await Cart.create({
                user: req.user.id,
                items: [
                    {
                        product: productId,
                        quantity: qty
                    }
                ]
            });

        } else {

            const itemIndex = cart.items.findIndex(
                item => item.product.toString() === productId
            );

            if (itemIndex > -1) {

                const newQty = cart.items[itemIndex].quantity + qty;

                if (newQty > product.stock) {
                    return res.status(400).json({
                        success: false,
                        message: "Stock limit exceeded"
                    });
                }

                cart.items[itemIndex].quantity = newQty;

            } else {

                cart.items.push({
                    product: productId,
                    quantity: qty
                });

            }

            await cart.save();
        }

        return res.status(200).json({
            success: true,
            message: "Product added to cart successfully",
            data: cart
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==============================
// Get Cart
// ==============================
const getCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({ user: req.user.id })
        

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

let totalPrice = 0;
let cartItems = [];

for (const item of cart.items) {

    const product = await getProductById(item.product);

    const price = product.discountPrice > 0
        ? product.discountPrice
        : product.price;

    totalPrice += price * item.quantity;

    cartItems.push({
        product,
        quantity: item.quantity
    });
}

        return res.status(200).json({
            success: true,
            message: "Cart fetched successfully",
            totalPrice,
            cartItems,
            
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==============================
// Update Quantity
// ==============================
const updateQuantity = async (req, res) => {
    try {

        const { quantity,productId } = req.body;

        if (quantity <= 0) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be greater than 0"
            });
        }

        const product = await getProductById(productId);;

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Stock not available"
            });
        }

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            item => item.product.toString() === productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart"
            });
        }

        item.quantity = quantity;

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Quantity updated successfully",
            data: cart
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==============================
// Remove Product
// ==============================
const removeProduct = async (req, res) => {
    try {

        const { productId } = req.params;

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== productId
        );

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Product removed successfully",
            data: cart
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


// ==============================
// Clear Cart
// ==============================
const clearCart = async (req, res) => {
    try {

        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = [];

        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            data: cart
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    addToCart,
    getCart,
    updateQuantity,
    removeProduct,
    clearCart,
};