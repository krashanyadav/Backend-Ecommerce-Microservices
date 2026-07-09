require("dotenv").config();

const app = require("./route/proxyRoute.js");


app.listen(process.env.PORT, () => {
    console.log(`API Gateway running on ${process.env.PORT}`);
});