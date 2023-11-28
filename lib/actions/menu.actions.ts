"use server"

import { connectToDB } from "@/utils/mongoose"
import { Menu } from "../models/menu.model";
import { MenuType } from "@/types/types";
import { jsonify } from "../utils";

export const fetchMenu = async (menuId: string) => {
    if (!menuId) return null;
    try {
        connectToDB();
        const menu = await Menu.findById(menuId);
        const jsonMenu = menu.toJSON();
        return jsonify(jsonMenu);
    } catch (error) {
        console.log("fetchMenu error: ", error);
    }
}

export const fetchMenuBySlug = async (slug: string) => {
    if (!slug) return null;
    try {
        connectToDB();
        const menu = await Menu.findOne({slug});

        return jsonify(menu);
    } catch (error) {
        console.log("fetchMenu error: ", error);
    }
}

export const UpdateMenuInfo = async (menuId: string, newRestaurantName: string, slug: string) => {
    if (!menuId) return { status: 400, message: "Invalid menuId" };

    console.log(menuId, newRestaurantName, slug);

    try {
        connectToDB();

        // Find the menu by ID to get its current slug
        const existingMenu = await Menu.findById(menuId);

        if (!existingMenu) {
            return { status: 400, message: "Menu not found" };
        }

        console.log("menu exists")

        // Check if the new slug is already in use (excluding the current document)
        const slugExists = await Menu.exists({ slug, _id: { $ne: existingMenu._id } });

        console.log(slugExists);


        if (slugExists) {
            console.log("slug exists")
            return { status: 400, message: "This slug is already in use" };


        }

        console.log("menu")
        console.log(existingMenu)

        // If the slug is unique, update the restaurantName and slug
        const updatedMenu = await Menu.findByIdAndUpdate(
            menuId,
            { $set: { restaurantName: newRestaurantName, slug: slug } },
            { new: true }
        );

        console.log("updated menu: ")
        console.log(updatedMenu)

        const jsonifiedUpdatedMenu = await jsonify(updatedMenu);

        console.log("josnified menu")
        console.log(jsonifiedUpdatedMenu)


        return { status: 200, message: "Menu updated successfully", jsonifiedUpdatedMenu };
    } catch (error) {
        console.error(error);
        return { status: 500, message: "Internal Server Error" };
    }
};


export const addCategory = async (menuId: string, categoryName: string) => {
    try {
        connectToDB();

        const existingMenu = await Menu.findById(menuId) as MenuType;

// Check if a category with the same name already exists
        const categoryExists = existingMenu.categories.some(category => category.name === categoryName);

        if (categoryExists) {
        // Handle the case where the category already exists (e.g., return an error)
            const res = {
                success: false,
                error: "Aceasta categorie exista deja"
            }
            return res
        } else {
        // If the category doesn't exist, add it to the categories array
        const updatedMenu = await Menu.findByIdAndUpdate(
            menuId,
            { $push: { categories: { name: categoryName, products: [] } } },
            { new: true } // This option returns the updated document
        );
        // Handle success
        if (updatedMenu) {
            // Update the component's state with the updated menu
            console.log('Category added:', updatedMenu);
            const res = {
                success: true,
                updatedMenu: jsonify(updatedMenu)
            }
            return res
        } else {
            console.log('Menu not found or category not added.');
        }
        }

    } catch (error) {
        console.log("Failed to add category: ", error)
    }
}

export const addProductToCategory = async (menuId: string, categoryName: string, product: object) => {
    try {
        connectToDB();

        console.log({menuId, categoryName, product})

        const menu = await Menu.findById(menuId);

        console.log({menu})

        if (!menu) throw new Error("Menu not found");

        const category = menu.categories.find((cat: any) => cat.name === categoryName);

        console.log({category})

        if (!category) throw new Error(`Category "${categoryName}" not found in the menu`);

        category.products.push(product);
        console.log(category.products);

        console.log({category})

        const updatedMenu = await menu.save();

        return jsonify(updatedMenu);
    } catch (error) {
        console.log("Error adding product to category: ", error);
    }
}

export const uploadMenuPreviewImage = async (menuId: string, menuPreviewImage: string) => {
    try {
        connectToDB();

        const updatedMenu = await Menu.findByIdAndUpdate(
            menuId,
            { $set: { menuPreviewImage: menuPreviewImage } },
            { new: true } // This option returns the updated document
        );

        return jsonify(updatedMenu);

        
    } catch (error) {
        console.error("Error uploading menu preview image: ", error);
    }
}