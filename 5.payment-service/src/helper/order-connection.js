const axios = require("axios");

// ===============================
// Get Single Order
// ===============================
const getOrder = async (orderId, cookie) => {

    try {

        const response = await axios.get(
            `${process.env.ORDER_SERVICE_URL}/api/order/singOrder/${orderId}`,
            {
                headers: {
                    Cookie: cookie
                }
            }
        );
// console.log(response.data.data)
        return response.data.data;

    } catch (error) {

        console.log(error.response?.data || error.message);
        return null;

    }

};

// ===============================
// Update Payment Status
// ===============================
const updatePaymentStatus = async (orderId, paymentId) => {

    try {

        const response = await axios.put(
            `${process.env.ORDER_SERVICE_URL}/api/order/updtPayStatus/${orderId}`,
            {
                paymentStatus: "Paid",
                paymentId
            }
        );
console.log(response.data)
        return response.data;

    } catch (error) {

        console.log(error.response?.data || error.message);
        return null;

    }

};

module.exports = {
    getOrder,
    updatePaymentStatus
};