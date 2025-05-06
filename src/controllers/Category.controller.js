import prisma from "../db/config.js";

export const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                title: true
            },
            orderBy: {
                title: 'asc' // Alphabetically sorted
            }
        });

        // Transform the result to a simple array of titles
        const categoryTitles = categories.map(cat => cat.title);

        return res.status(200).json({
            success: true,
            categories: categoryTitles
        });

    } catch (error) {
        console.error("Error fetching categories:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to fetch categories"
        });
    }
};


// ...existing code...

export const createCategory = async (req, res) => {
    try {
        const { title, description } = req.body;

        // Validate required fields
        if (!title) {
            return res.status(400).json({
                success: false,
                error: "Category title is required"
            });
        }

        // Check if category already exists
        const existingCategory = await prisma.category.findFirst({
            where: {
                title: title.trim()
            }
        });

        if (existingCategory) {
            return res.status(409).json({
                success: false,
                error: "Category already exists"
            });
        }

        // Create new category
        const newCategory = await prisma.category.create({
            data: {
                title: title.trim(),
                description: description || `Category for ${title.trim()}`
            }
        });

        return res.status(201).json({
            success: true,
            message: "Category created successfully",
            category: newCategory
        });

    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to create category"
        });
    }
};