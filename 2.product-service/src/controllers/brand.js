const Brand = require("../models/brandModel.js");
const generateSlug = require("../helpers/genrateSlug.js");

const createBrand = async (req, res) => {
    try {

        const { name, description } = req.body;

        // Check existing brand
        const existingBrand = await Brand.findOne({
            name: name.trim()
        });

        if (existingBrand) {
            return res.status(409).json({
                success: false,
                message: "Brand already exists"
            });
        }

        // Generate slug
        const slug = generateSlug(name);

        // Create brand
        const brand = await Brand.create({
            name,
            slug,
            description
        });

        return res.status(201).json({
            success: true,
            message: "Brand created successfully",
            data: brand
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create brand"
        });

    }
};

//2. get all category
const getAllBrand = async (req, res) => {
    try {
        // Check existing category
        const existingBrand = await Brand.find({isActive:true})

        if (!existingBrand) {
            return res.status(500).json({
                success: false,
                message: "server error"
            });
        }

        return res.status(200).json({
            success: true,
            data: existingBrand
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
const getSingleBrand = async (req, res) => {
    try {

        const { slug } = req.params;

        const brand = await Brand.findOne({
            slug,
            isActive: true
        });

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "Brand not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Brand fetched successfully",
            data: brand
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

//4. update category
const updateBrand =async (req, res) => {
try {  
    let{ id }= req.params
    console.log(id)
    const brand = await Brand.findOne({
        _id:id,
        isActive:true
    })

    if(!brand){
        return res.status(404).json({
            success:false,
            message:"brand not found"
        })
    }

    
    const {name,description }=req.body
    
    const existName = await Brand.findOne({name})
    if(existName){
        return res.status(409).json({
            success:false,
            message:"brand is already exist"
            
        }) 
    }

    const updslug = generateSlug(name)


    if(req.body?.name) brand.name =name
    if(req.body?.description) brand.description =description
    brand.slug =updslug

    await brand.save()

    return res.status(200).json({
        success:true,
        message:"brand updated successfully",
        brand
    })
} catch (error) {
        return res.status(404).json({
            success:false,
            message:"brand updation failed"
            
        })   
    }

}

//5. delete category
// (Soft Delete) -> not whole id of content delete
const deleteBrand = async (req, res) => {
    try {

        const { id } = req.params;

        const brand = await Brand.findById(id);

        if (!brand) {
            return res.status(404).json({
                success: false,
                message: "brand not found"
            });
        }

        if (!brand.isActive) {
            return res.status(400).json({
                success: false,
                message: "brand already deleted"
            });
        }
// soft delete 
        brand.isActive = false;
        await brand.save();

        return res.status(200).json({
            success: true,
            message: "brand deleted successfully",
            brand
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};


module.exports = {
    createBrand,
    getAllBrand,
    getSingleBrand,
    updateBrand,
    deleteBrand
};