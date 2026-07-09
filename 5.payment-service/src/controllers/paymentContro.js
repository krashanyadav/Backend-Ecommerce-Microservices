const razorpay = require("../config/razorpay.js");
const { getOrder ,updatePaymentStatus} = require("../helper/order-connection.js");
const crypto = require("crypto");
//1. cretae payment order
const createPaymentOrder = async (req, res) => {

    try {

        const { orderId } = req.body;

        // Get Order from Order Service
        const order = await getOrder(orderId, req.headers.cookie);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Already Paid
        if (order.paymentStatus === "Paid") {
            return res.status(400).json({
                success: false,
                message: "Order is already paid"
            });
        }
        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({
                success: false,
                message: "Order is already cancelled can't  paid"
            });
        }

        // Razorpay Options
        const options = {

            amount: order.totalPrice * 100, // Paisa

            currency: "INR",

            receipt: order._id.toString()

        };

        // Create Razorpay Order
        const paymentOrder = await razorpay.orders.create(options);
        paymentOrder.open()

        return res.status(200).json({

            success: true,

            message: "Payment Order Created",

            data: {

                orderId: paymentOrder.id,

                amount: paymentOrder.amount,

                currency: paymentOrder.currency,

                key: process.env.RAZORPAY_KEY_ID

            }

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};
//2. verify payment

const verifyPayment = async (req, res) => {

    try {

        const {

            razorpay_order_id,

            razorpay_payment_id,

            razorpay_signature,

            orderId

        } = req.body;

        // Generate Signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        // Verify Signature
        if (generatedSignature !== razorpay_signature) {

            return res.status(400).json({

                success: false,

                message: "Payment Verification Failed"

            });

        }

        // Update Order Service
        await updatePaymentStatus(orderId, razorpay_payment_id);

        return res.status(200).json({

            success: true,

            message: "Payment Verified Successfully"

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

};


module.exports = {
    createPaymentOrder,
    verifyPayment
};