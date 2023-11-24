"use server"

import { connectToDB } from "@/utils/mongoose"
import { Menu } from "../models/menu.model";
import { MenuType } from "@/types/types";

export const fetchMenu = async (menuId: string) => {
    if (!menuId) return null;
    try {
        connectToDB();
        const menu = await Menu.findById(menuId);
        const jsonMenu = menu.toJSON();
        return JSON.parse(JSON.stringify(jsonMenu));
    } catch (error) {
        console.log("fetchMenu error: ", error);
    }
}

export const updateRestaurantName = async (menuId: string, newRestaurantName: string) => {
    if (!menuId) return null;

    try {
        connectToDB();

        const updatedRestaurantName = await Menu.findByIdAndUpdate(menuId, { $set: { restaurantName: newRestaurantName }})

        updatedRestaurantName.save();
    } catch (error) {
        console.log(error);
    }
}

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
                updatedMenu: JSON.parse(JSON.stringify(updatedMenu))
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

        return JSON.parse(JSON.stringify(updatedMenu));
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

        return JSON.parse(JSON.stringify(updatedMenu));

        
    } catch (error) {
        console.error("Error uploading menu preview image: ", error);
    }
}