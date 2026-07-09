const Category = require("../models/categoryModel.js");
const generateSlug = require("../helpers/genrateSlug.js");
const { castObject } = require("../models/product.js");

const createCategory = async (req, res) => {
    try {

        const { name, description } = req.body;

        // Check existing category
        const existingCategory = await Category.findOne({
            name: name.trim()
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        // Generate slug
        const slug = generateSlug(name);

        // Create category
        const category = await Category.create({
            name,
            slug,
            description
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create category"
        });

    }
};

//2. get all category
const getAllCategory = async (req, res) => {
    try {


        // Check existing category
        const existingCategory = await Category.find({isActive:true})

        if (!existingCategory) {
            return res.status(500).json({
                success: false,
                message: "server error"
            });
        }

        return res.status(200).json({
            success: true,
            data: existingCategory
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "server error"
        });

    }
};


// 3. Get Single Category
const getSingleCategory = async (req, res) => {
    try {

        const { slug } = req.params;

        const category = await Category.findOne({
            slug,
            isActive: true
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: category
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

//4. update category
const updateCategory =async (req, res) => {
try {  
    let{ id }= req.params
    console.log(id)
    const category = await Category.findOne({
        _id:id,
        isActive:true
    })

    if(!category){
        return res.status(404).json({
            success:false,
            message:"category not found"
        })
    }

    
    const {name,description }=req.body
    
    const existName = await Category.findOne({name})
    if(existName){
        return res.status(409).json({
            success:false,
            message:"category is already exist"
            
        }) 
    }

    const updslug = generateSlug(name)


    if(req.body?.name) category.name =name
    if(req.body?.description) category.description =description
    category.slug =updslug

    await category.save()

    return res.status(200).json({
        success:true,
        message:"category updated successfully",
        category
    })
} catch (error) {
        return res.status(404).json({
            success:false,
            message:"category updation failed"
            
        })   
    }

}

//5. delete category
// (Soft Delete) -> not whole id of content delete
const deleteCategory = async (req, res) => {
    try {

        const { id } = req.params;

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        if (!category.isActive) {
            return res.status(400).json({
                success: false,
                message: "Category already deleted"
            });
        }
// soft delete 
        category.isActive = false;
        await category.save();

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            category
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    createCategory,
    getAllCategory,
    getSingleCategory,
    updateCategory,
    deleteCategory
};