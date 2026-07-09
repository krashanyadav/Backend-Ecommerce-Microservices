const authorizeRole = (...roles) => {
    return (req, res, next) => {
        try {
        // console.log("Allowed Roles:", roles);
        // console.log("User Role:", req.user.role);

            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized access."
                });
            }

            if (!roles.includes(req.user.role)) {
                return res.status(403).json({
                    success: false,
                    message: "You are not allowed to access this resource."
                });
            }

            next();

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    };
};

module.exports = authorizeRole;