const axios = require("axios");

// Get User Cart
const getCart = async (Cookies) => {
    try {

        const response = await axios.get(
            `${process.env.CART_SERVICE_URL}/getCart`,
            {
                headers: {
                    Cookie: Cookies
                }
            }
        );
// console.log(response.data)
        return response.data;

    } catch (error) {

        console.log("Cart Service Error :", error.message);
        return null;

    }
};

// Clear User Cart
const clearCart = async (Cookies) => {
    try {

        await axios.delete(
            `${process.env.CART_SERVICE_URL}/api/cart/clear`,{
                  headers: {
                    Cookie: Cookies
                }
            }
             
        );

        return true;

    } catch (error) {

        console.log("Cart Service Error :", error.message);
        return false;

    }
};

module.exports = {
    getCart,
    clearCart
};