const { body, validationResult } = require("express-validator");

// ================= Validation Result =================

const validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation Failed",
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }

    next();
};

// ================= Register =================

const registerValidation = [

    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("First name is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("First name must be between 2 and 30 characters"),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("Last name is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("Last name must be between 2 and 30 characters"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),

    validate
];

// ================= Login =================

const loginValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    validate
];

// ================= Update Profile =================

const updateProfileValidation = [

    body("firstName")
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage("First name must be between 2 and 30 characters"),

    body("lastName")
        .optional()
        .trim()
        .isLength({ min: 2, max: 30 })
        .withMessage("Last name must be between 2 and 30 characters"),

    body("profileImage")
        .optional()
        .isString()
        .withMessage("Invalid profile image"),

    validate
];

// ================= Change Password =================

const changePasswordValidation = [

    body("oldPassword")
        .notEmpty()
        .withMessage("Old password is required"),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),

    validate
];

// ================= Forgot Password =================

const forgotPasswordValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email"),

    validate
];

// ================= Verify OTP =================

const verifyOtpValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("otp")
        .notEmpty()
        .withMessage("OTP is required")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be exactly 6 digits")
        .isNumeric()
        .withMessage("OTP must contain only numbers"),

    validate
];

// ================= Reset Password =================

const resetPasswordValidation = [

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Enter a valid email"),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters"),

    body("confirmPassword")
        .notEmpty()
        .withMessage("Confirm password is required")
        .custom((value, { req }) => {

            if (value !== req.body.newPassword) {
                throw new Error("Passwords do not match");
            }

            return true;
        }),

    validate
];

module.exports = {
    registerValidation,
    loginValidation,
    updateProfileValidation,
    changePasswordValidation,
    forgotPasswordValidation,
    verifyOtpValidation,
    resetPasswordValidation
};