const { body, validationResult } = require("express-validator");

// Validation Result
const validation = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });

    }

    next();

};
//1. Category Validation
const categoryValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Category name is required")
        .bail()
        .isLength({ min: 2, max: 50 })
        .withMessage("Category name must be between 2 and 50 characters"),

    body("description")
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters"),
    validation
];


//2. Product Validation
const productValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Product name is required.")
        .isLength({ min: 3, max: 100 })
        .withMessage("Product name must be between 3 and 100 characters."),

    body("description")
        .trim()
        .notEmpty()
        .withMessage("Description is required.")
        .isLength({ min: 10 })
        .withMessage("Description must be at least 10 characters."),

    body("price")
        .notEmpty()
        .withMessage("Price is required.")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number."),

    body("discountPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Discount price must be a positive number."),

    body("stock")
        .notEmpty()
        .withMessage("Stock is required.")
        .isInt({ min: 0 })
        .withMessage("Stock must be 0 or greater."),

    body("category")
        .notEmpty()
        .withMessage("Category is required.")
        .isMongoId()
        .withMessage("Invalid Category ID."),

    body("brand")
        .notEmpty()
        .withMessage("Brand is required.")
        .isMongoId()
        .withMessage("Invalid Brand ID."),

    body("isFeatured")
        .optional()
        .isBoolean()
        .withMessage("isFeatured must be true or false."),

validation

];

module.exports = categoryValidation,productValidation

