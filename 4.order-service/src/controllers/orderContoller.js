const Order = require("../models/orderModel.js");
const { getCart, clearCart } = require("../helper/cart-conne.js");
//1. create cart / add to cart
const createOrder = async (req, res) => {

    try {

        const { shippingAddress } = req.body;

        // Get User Cart
        const cart = await getCart(req.headers.cookie);

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        if (cart.cartItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Prepare Order Items
        const orderItems = cart.cartItems.map((item) => ({

            product: item.product._id,

            quantity: item.quantity,

            price: item.product.discountPrice > 0
                ? item.product.discountPrice
                : item.product.price

        }));

        // Create Order
        const order = await Order.create({

            user: req.user.id,

            items: orderItems,

            totalPrice: cart.totalPrice,

            shippingAddress

        });

        // Clear Cart
        await clearCart(req.headers.cookie);

        return res.status(201).json({
            success: true,
            message: "Order confiremed successfully",
            data: order
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
//2. getmyorder
const getMyOrders = async (req, res) => {

    try {

        const orders = await Order.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No orders found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Orders fetched successfully",
            data: orders
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

//3. get single order
const getSingleOrder = async (req, res) => {

    try {

        const { orderId } = req.params;

        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: order
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};
//4. cancelOrder

const cancelOrder = async (req, res) => {

    try {

        const { orderId } = req.params;

        const order = await Order.findOne({
            _id: orderId,
            user: req.user.id
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.orderStatus !== "Pending") {
            return res.status(400).json({
                success: false,
                message: "Order cannot be cancelled"
            });
        }

        order.orderStatus = "Cancelled";

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

//5. updadte orderStatus 

const updateOrderStatus = async (req, res) => {

    try {

        const { orderId } = req.params;
        const { orderStatus } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cancelled order cannot be updated"
            });
        }

        order.orderStatus = orderStatus;

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


//5. updadte paymentStatus 

const updatePaymentStatus = async (req, res) => {

    try {

        const { orderId } = req.params;
        const { paymentStatus, paymentId } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cancelled order cannot be updated"
            });
        }

        if (order.paymentStatus === "Paid") {
            return res.status(400).json({
                success: false,
                message: "Order is already paid"
            });
        }

        order.paymentStatus = paymentStatus;
        order.paymentId = paymentId;

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Payment updated successfully",
            data: order
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



module.exports = {
    createOrder,
     getMyOrders,
     getSingleOrder,
      cancelOrder,
      updateOrderStatus,
      updatePaymentStatus
};