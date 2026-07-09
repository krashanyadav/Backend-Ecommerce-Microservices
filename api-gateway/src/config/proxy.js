const { createProxyMiddleware } = require("http-proxy-middleware");
require("dotenv").config();

const authProxy = createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
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

module.exports = {
    authProxy,
    productProxy,
    cartProxy,
    orderProxy,
    paymentProxy
};