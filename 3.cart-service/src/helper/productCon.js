const axios = require("axios");
require("dotenv").config()
const getProductById = async (productId) => {
    try {

        const response = await axios.get(
            `${process.env.PRODUCT_SERVICE_URL}/v3/getById/${productId}`
        );

        return response.data.data;

        console.log(response.data)
    } catch (error) {

        console.log("Product Service Error :", error.message);
        return null;

    }
};

module.exports = getProductById;