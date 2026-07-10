const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const authProxy = createProxyMiddleware({
    target: "http://localhost:4000",
    changeOrigin: true
});

const productProxy = createProxyMiddleware({
    target: process.env.PRODUCT_SERVICE_URL,
    changeOrigin: true
});

const cartProxy = createProxyMiddleware({
    target: process.env.CART_SERVICE_URL,
    changeOrigin: true
});

const orderProxy = createProxyMiddleware({
    target: process.env.ORDER_SERVICE_URL,
    changeOrigin: true
});

const paymentProxy = createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL,
    changeOrigin: true
});
// console.log(authProxy)


module.exports = {
    authProxy,
    productProxy,
    cartProxy,
    orderProxy,
    paymentProxy
};