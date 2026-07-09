const Redis = require("ioredis")
const dotenv =require("dotenv")
dotenv.config()

const redis = new Redis(process.env.REDIS_URI);

redis.on("connect", () => {
    console.log("✅ Redis Connected");
});

redis.on("error", (err) => {
    console.error("❌ Redis Error:", err.message);
});


const rateLimiter = (limit, windowSeconds) => {

    return async (req, res, next) => {

        try {

            const key = `rate-limit:${req.ip}`;

            const requests = await redis.incr(key);
            console.log(requests)

            if (requests === 1) {
                await redis.expire(key, windowSeconds);
            }

            if (requests > limit) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests. Please try again later."
                });

            }

            next();

        } catch (error) {
            console.log(error);
            next();
        }

    };

};

module.exports = rateLimiter;