const Product = require("../models/product.js");
const Category = require("../models/categoryModel.js");
const Brand = require("../models/brandModel.js");
const generateSlug = require("../helpers/genrateSlug.js");
const uploadFile = require("../config/cloudinary.js");
const redis = require("../config/redis.js");

//1. Create Product
const createProduct = async (req, res) => {
    try {

        const {
            name,
            description,
            price,
            discountPrice,
            stock,
            category,
            brand,
            isFeatured
        } = req.body;

        // 1. Validate Images
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required."
            });
        }

        if (req.files.length > 4) {
            return res.status(400).json({
                success: false,
                message: "Maximum 4 images are allowed."
            });
        }

        // 2. Duplicate Product
        const existingProduct = await Product.findOne({
            name,
            isActive: true
        });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: "Product already exists."
            });
        }

        // 3. Category Exists
        const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        // 4. Brand Exists
        const brandExists = await Brand.findById(brand);

        if (!brandExists) {
            return res.status(404).json({
                success: false,
                message: "Brand not found."
            });
        }

        // 5. Generate Slug
        const slug = generateSlug(name);

        // Image Upload
        // (Cloudinary next step)
        let imageUrls = [];

        for (const file of req.files) {

            const image = await uploadFile(file.path);

            imageUrls.push(image);
        }


        // Save Product
        const product = await Product.create({
            name,
            slug,
            description,
            price,
            discountPrice,
            stock,
            category,
            brand,
            isFeatured,
            images:imageUrls    // next step me Cloudinary images aayengi
        });
/// redis update............................................
        const keys = await redis.keys("product:*");
        if (keys.length) {
            await redis.del(...keys);
        }


        return res.status(201).json({
            success: true,
            message: "Product created successfully.",
            product
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

//2. get all product 

const getallProduct = async (req, res) => {
    try {

        const cacheKey = `product:${"getall"}`;

        // 1. Check Redis
        const cachedProducts = await redis.get(cacheKey);

        if (cachedProducts) {
            console.log(" Data From Redis");

            return res.status(200).json({
                success: true,
                source: "redis",
                products: JSON.parse(cachedProducts)
            });
        }

        console.log(" Data From MongoDB");

        const products = await Product.find({ isActive: true })
            .populate("category", "name")
            .populate("brand", "name");

        // 2. Store in Redis (10 Minutes)
        await redis.set(
            cacheKey,
            JSON.stringify(products),
            "EX",
            600
        );

        return res.status(200).json({
            success: true,
            source: "mongodb",
            products
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
// 3. Get Single product
const getSingalProduct = async (req, res) => {
    try {

        const { slug } = req.params;
console.log(slug)
        const cacheKey = `product:${slug}`;

        // Check Redis
        const cachedProduct = await redis.get(cacheKey);

        if (cachedProduct) {

            console.log(" Product From Redis");

            return res.status(200).json({
                success: true,
                source: "redis",
                product: JSON.parse(cachedProduct)
            });
        }

        console.log("Product From MongoDB");

        const product = await Product.findOne({
            slug,
            isActive: true
        })

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        // Save Redis
        await redis.set(
            cacheKey,
            JSON.stringify(product),
            "EX",
            600
        );

        return res.status(200).json({
            success: true,
            source: "mongodb",
            product
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
//4. update product
const updateProduct = async (req, res) => {
    try {

        const { id } = req.params;


        let {name,description,price,category,brand,discountPrice,stock,isFeatured,isActive}=req.body;

        // Product Exists
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }


        // Category Exists
       const categoryExists = await Category.findById(category);

        if (!categoryExists) {
            return res.status(404).json({
                success: false,
                message: "Category not found."
            });
        }

        // Brand Exists
        const brandExists = await Brand.findById(brand);

        if (!brandExists) {
            return res.status(404).json({
                success: false,
                message: "Brand not found."
            });
        }

        // Generate Slug
        const slug = generateSlug(name);

        // Upload New Images (Optional)
        let imageUrls = product.images;

        if (req.files && req.files.length > 0) {

            imageUrls = [];

            for (const file of req.files) {

                const image = await uploadFile(file.path);

                imageUrls.push(image);
            }
        }

    

        if (req.body?.name) {
            product.name = name;
            product.slug = generateSlug(name);
        }

        if (req.body?.description) {
            product.description = description;
        }

        if (req.body?.price) {
            product.price = price;
        }

        if (req.body?.discountPrice) {
            product.discountPrice = discountPrice;
        }

        if (req.body?.stock) {
            product.stock = stock;
        }

        if (req.body?.isFeatured) {
            product.isFeatured = isFeatured;
        }
        if (req.body?.isActive) {
            product.isActive = isActive;
        }

        await product.save();

/// redis update............................................
        const keys = await redis.keys("product:*");
        if (keys.length) {
            await redis.del(...keys);
        }

        return res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            product
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
//5.delete product
const deleteProduct = async (req, res) => {
    try {

        const { id } = req.params;

        // Check Product
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        // Already Deleted
        if (!product.isActive) {
            return res.status(400).json({
                success: false,
                message: "Product already deleted."
            });
        }

        // Soft Delete
        product.isActive = false;

        await product.save();

/// redis update............................................
        const keys = await redis.keys("product:*");
        if (keys.length) {
            await redis.del(...keys);
        }


        return res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
            product
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

//6.search filter pagination 
const getfind= async (req, res) => {
    try {

        // ==============================
        // 1. Destructure Query Params
        // ==============================

        const {
            search,
            category,
            brand,
            minPrice,
            maxPrice,
            isFeatured,
            page = 1,
            limit = 10
        } = req.query;


        // ==============================
        // 2. Default Query
        // ==============================

        let query = {
            isActive: true
        };


        // ==============================
        // 3. Search Filter
        // ==============================

        if (search) {
            query.name = {
                $regex: search,
                $options: "i"
            };
        }


        // ==============================
        // 4. Category Filter
        // ==============================

        if (category) {
            query.category = category;
        }


        // ==============================
        // 5. Brand Filter
        // ==============================

        if (brand) {
            query.brand = brand;
        }


        // ==============================
        // 6. Price Filter
        // ==============================

        if (minPrice || maxPrice) {

            query.price = {};

            if (minPrice) {
                query.price.$gte = Number(minPrice);
            }

            if (maxPrice) {
                query.price.$lte = Number(maxPrice);
            }

        }


        // ==============================
        // 7. Featured Filter
        // ==============================

        if (isFeatured !== undefined) {
            query.isFeatured = isFeatured === "true";
        }


        // ==============================
        // 8. Pagination
        // ==============================

        const currentPage = Number(page);
        const perPage = Number(limit);

        const skip = (currentPage - 1) * perPage;


        // ==============================
        // 9. Total Products
        // ==============================

        const totalProducts = await Product.countDocuments(query);


        // ==============================
        // 10. Fetch Products
        // ==============================

        const products = await Product.find(query)
            .populate("category", "name")
            .populate("brand", "name")
            .skip(skip)
            .limit(perPage);


        // ==============================
        // 11. Response
        // ==============================

        return res.status(200).json({

            success: true,

            currentPage,

            totalPages: Math.ceil(totalProducts / perPage),

            totalProducts,

            products

        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

//...........................for cart service ......................

const getProductById = async (req, res) => {
    try {

        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: product
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
module.exports = {
    createProduct,
    getallProduct,
    getSingalProduct,
    updateProduct,
    deleteProduct,
    getfind,
    getProductById
};