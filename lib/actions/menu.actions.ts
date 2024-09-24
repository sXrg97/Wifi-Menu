"use server";

import { MenuType, ProductType } from "@/types/types";
import { UTApi } from "uploadthing/server";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, storage } from "@/utils/firebase";
import { jsonify } from "../utils";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { randomUUID } from "crypto";

export const createMenu = async (formData: FormData) => {
  try {
    const restaurantName = formData.get('restaurantName') as string;
    const slug = formData.get('slug') as string;
    const tables = JSON.parse(formData.get('tables') as string);
    const owner = formData.get('owner') as string;

    // Check if the slug is already in use
    const menusRef = collection(db, 'menus');
    const slugQuery = query(menusRef, where('slug', '==', slug));
    const slugSnapshot = await getDocs(slugQuery);

    if (!slugSnapshot.empty) {
      return { success: false, error: 'Acest slug este deja folosit de un alt meniu' };
    }

    const menuDoc = await addDoc(menusRef, {
      restaurantName,
      slug,
      tables,
      owner: doc(db, 'users', owner),
      isLive: false,
      categories: [],
      lifetimeViews: 0,
      tier: 'free',
    });

    let updateData: any = {
      _id: menuDoc.id,
    };

    if (formData.get('restaurantCoverImage')) {
      const restaurantCoverImage = formData.get('restaurantCoverImage') as File;
      const storageRef = ref(storage, `menus/${menuDoc.id}/cover/`);
      await uploadBytes(storageRef, restaurantCoverImage);
      const imageUrl = await getDownloadURL(storageRef);
      updateData.menuPreviewImage = imageUrl;
    }

    await updateDoc(doc(menusRef, menuDoc.id), updateData);

    // Find the user document
    const usersRef = collection(db, 'users');
    const userQuery = query(usersRef, where('clerkUserId', '==', owner));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      const userDoc = userSnapshot.docs[0];
      // Update the user document with the new menu reference
      await updateDoc(doc(usersRef, userDoc.id), {
        menu: doc(menusRef, menuDoc.id),
      });
    } else {
      console.error('User not found when creating menu');
      throw new Error('User not found');
    }

    return { success: true, menuId: menuDoc.id };
  } catch (error) {
    console.error('Error creating menu:', error);
    throw error;
  }
};

export const fetchMenu = async (menuId: string) => {
  if (!menuId) return null;

  try {
    const menuRef = doc(db, "menus", menuId);
    const menuSnapshot = await getDoc(menuRef);

    if (menuSnapshot.exists()) {
      const menuData = menuSnapshot.data();
      return jsonify(menuData);
    } else {
      console.log("Menu not found");
      return null;
    }
  } catch (error) {
    console.log("fetchMenu error:", error);
    return null;
  }
};

export const fetchMenuBySlug = async (slug: string) => {
  if (!slug) return null;

  try {
    const menuRef = collection(db, "menus");
    const menuQuery = query(menuRef, where("slug", "==", slug));
    const menuSnapshot = await getDocs(menuQuery);

    if (!menuSnapshot.empty) {
      const menuData = menuSnapshot.docs[0].data();
      return jsonify(menuData);
    } else {
      console.log("Menu not found");
      return null;
    }
  } catch (error) {
    console.log("fetchMenuBySlug error:", error);
    return null;
  }
};

export const UpdateMenuInfo = async (
  menuId: string,
  newRestaurantName: string,
  slug: string,
  tables: number,
  formData: FormData
) => {
  if (!menuId) return { status: 400, message: "Invalid menuId" };

  try {
    const menuRef = doc(db, "menus", menuId);
    const menuSnapshot = await getDoc(menuRef);

    if (!menuSnapshot.exists()) {
      return { status: 400, message: "Menu not found" };
    }

    const menusRef = collection(db, "menus");
    const slugQuery = query(menusRef, where("slug", "==", slug));
    const slugSnapshot = await getDocs(slugQuery);

    if (!slugSnapshot.empty && slugSnapshot.docs[0].id !== menuId) {
      return { status: 400, message: "This slug is already in use" };
    }

    let updateData: any = {
      restaurantName: newRestaurantName,
      slug: slug,
      tables: Array.from({ length: tables }, (_, index) => ({
        tableNumber: index + 1,
        callWaiter: false,
        requestBill: false,
      })),
    };

    if (formData.get("restaurantCoverImage")) {
      const restaurantCoverImage = formData.get("restaurantCoverImage") as File;
      const storageRef = ref(storage, `menus/${menuId}/cover/`);
      await uploadBytes(storageRef, restaurantCoverImage);
      const imageUrl = await getDownloadURL(storageRef);
      updateData.menuPreviewImage = imageUrl;
    }

    await updateDoc(menuRef, updateData);

    const updatedMenuSnapshot = await getDoc(menuRef);
    const updatedMenuData = updatedMenuSnapshot.data();

    return {
      status: 200,
      message: "Menu updated successfully",
      jsonifiedUpdatedMenu: jsonify(updatedMenuData),
    };
  } catch (error) {
    console.error(error);
    return { status: 500, message: "Internal Server Error" };
  }
};

export const addCategory = async (menuId: string, categoryName: string) => {
  try {
    const menuRef = doc(db, "menus", menuId);
    const menuSnapshot = await getDoc(menuRef);

    if (!menuSnapshot.exists()) {
      return { success: false, error: "Menu not found" };
    }

    const menuData = menuSnapshot.data();
    const categoryExists = menuData.categories?.some(
      (category: any) => category.name === categoryName
    );

    if (categoryExists) {
      return { success: false, error: "This category already exists" };
    } else {
      await updateDoc(menuRef, {
        categories: [
          ...(menuData.categories || []),
          { name: categoryName, products: [] },
        ],
      });

      const updatedMenuSnapshot = await getDoc(menuRef);
      const updatedMenuData = updatedMenuSnapshot.data();

      return { success: true, updatedMenu: jsonify(updatedMenuData) };
    }
  } catch (error) {
    console.log("Failed to add category:", error);
    return { success: false, error: "Failed to add category" };
  }
};

export const addProductToCategory = async (
  menuId: string,
  categoryName: string,
  productWithPicture: ProductType,
  formData?: FormData
): Promise<MenuType | null> => {
  try {
    const menuRef = doc(db, "menus", menuId);
    const menuSnapshot = await getDoc(menuRef);

    if (!menuSnapshot.exists()) {
      console.log("Menu not found");
      return null;
    }

    const menuData = menuSnapshot.data() as MenuType;
    const categories = menuData.categories || [];
    const categoryIndex = categories.findIndex(
      (cat) => cat.name === categoryName
    );

    if (categoryIndex === -1) {
      console.log(`Category "${categoryName}" not found in the menu`);
      return null;
    }

    // Upload the product picture to Firebase Storage (if provided)
    if (formData) {
      const productPicture = formData.get("productPicture") as File;
      if (productPicture) {
        const storageRef = ref(
          storage,
          `menus/${menuId}/products/${productPicture.name}`
        );
        await uploadBytes(storageRef, productPicture);
        productWithPicture.image = await getDownloadURL(storageRef);
      }
    }

    const productId = randomUUID();
    console.log("product id is " + productId);
    const productWithId = { ...productWithPicture, _id: productId };

    // Update products array in the specific category
    const updatedProducts = [
      ...(categories[categoryIndex].products || []),
      productWithId,
    ];

    // Update the entire categories array in Firestore
    const updatedCategories: { name: string; products: ProductType[] }[] = [
      ...categories,
    ];
    updatedCategories[categoryIndex] = {
      ...updatedCategories[categoryIndex],
      products: updatedProducts,
    };

    await updateDoc(menuRef, { categories: updatedCategories });

    const updatedMenuSnapshot = await getDoc(menuRef);
    const updatedMenuData = updatedMenuSnapshot.data() as MenuType;

    return jsonify(updatedMenuData);
  } catch (error) {
    console.log("Error adding product to category: ", error);
    throw error;
  }
};

export const deleteProduct = async (
  menuId: string,
  categoryName: string,
  productId: string
) => {
  try {
    const menuRef = doc(db, "menus", menuId);
    const menuSnapshot = await getDoc(menuRef);

    if (!menuSnapshot.exists()) {
      console.log("Menu not found");
      return null;
    }

    const menuData = menuSnapshot.data();
    const categories = menuData.categories || [];

    // Find the index of the category with the specified name
    const categoryIndex = categories.findIndex(
      (cat: any) => cat.name === categoryName
    );

    if (categoryIndex === -1) {
      console.log(`Category "${categoryName}" not found in the menu`);
      return null;
    }

    // Get the category object
    const category = categories[categoryIndex];

    // Find the index of the product with the specified ID within the category
    const productIndex = category.products.findIndex(
      (prod: any) => prod._id === productId
    );

    if (productIndex === -1) {
      console.log(`Product with ID "${productId}" not found in the category`);
      return null;
    }

    // Create a new products array without the product to be deleted
    const updatedProducts = [
      ...category.products.slice(0, productIndex),
      ...category.products.slice(productIndex + 1),
    ];

    // Create a new categories array with the updated products array
    const updatedCategories = [...categories];
    updatedCategories[categoryIndex] = {
      ...category,
      products: updatedProducts,
    };

    // Update the menu document with the updated categories array
    await updateDoc(menuRef, { categories: updatedCategories });

    const updatedMenuSnapshot = await getDoc(menuRef);
    const updatedMenuData = updatedMenuSnapshot.data();

    return jsonify(updatedMenuData);
  } catch (error) {
    console.log("Error deleting product: ", error);
    throw error;
  }
};

export const deleteCategory = async (menuId: string, categoryName: string) => {
  try {
    const menuRef = doc(db, "menus", menuId);
    const menuSnapshot = await getDoc(menuRef);

    if (!menuSnapshot.exists()) {
      console.log("Menu not found");
      return null;
    }

    const menuData = menuSnapshot.data();
    const categoryIndex = menuData.categories?.findIndex(
      (cat: any) => cat.name === categoryName
    );

    if (categoryIndex === -1) {
      console.log(`Category "${categoryName}" not found in the menu`);
      return null;
    }

    await updateDoc(menuRef, {
      categories: [
        ...menuData.categories.slice(0, categoryIndex),
        ...menuData.categories.slice(categoryIndex + 1),
      ],
    });

    const updatedMenuSnapshot = await getDoc(menuRef);
    const updatedMenuData = updatedMenuSnapshot.data();

    return jsonify(updatedMenuData);
  } catch (error) {
    console.log("Error deleting category: ", error);
    throw error;
  }
};

export const renameCategory = async (
  menuId: string,
  categoryName: string,
  newCategoryName: string
) => {
  try {
    const menuRef = doc(db, "menus", menuId);
    const menuSnapshot = await getDoc(menuRef);

    if (!menuSnapshot.exists()) {
      console.log("Menu not found");
      return null;
    }

    const menuData = menuSnapshot.data();
    const categories = menuData.categories || [];

    const categoryIndex = categories.findIndex(
      (cat: any) => cat.name === categoryName
    );

    if (categoryIndex === -1) {
      console.log(`Category "${categoryName}" not found in the menu`);
      return null;
    }

    // Update category name in the array
    categories[categoryIndex].name = newCategoryName;

    // Update categories array in Firestore
    await updateDoc(menuRef, {
      categories: categories,
    });

    const updatedMenuSnapshot = await getDoc(menuRef);
    const updatedMenuData = updatedMenuSnapshot.data();

    return jsonify(updatedMenuData);
  } catch (error) {
    console.log("Error renaming category: ", error);
    throw error;
  }
};

export const getRandomMenus = async (limit: number) => {
  try {
    const menusRef = collection(db, "menus");
    const menuQuery = query(menusRef, orderBy("__name__"));

    const menuSnapshot = await getDocs(menuQuery);
    const menus = menuSnapshot.docs
      .slice(0, limit) // Limit the number of documents
      .map((doc) => ({ id: doc.id, ...doc.data() }));

    return jsonify(menus);
  } catch (error) {
    console.log("Error getting random menus: ", error);
    throw error;
  }
};

export const getAllMenus = async () => {
  try {
    const menusRef = collection(db, "menus");
    const menuQuery = query(menusRef, orderBy("__name__"));

    const menuSnapshot = await getDocs(menuQuery);
    const menus = menuSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    return jsonify(menus);
  } catch (error) {
    console.log("Error getting all menus: ", error);
    throw error;
  }
};

export const increaseMenuViews = async (menuId: string) => {
  try {
    // Assuming 'menus' is the collection name
    const menuDocRef = doc(db, "menus", menuId);
    const menuDocSnapshot = await getDoc(menuDocRef);

    if (!menuDocSnapshot.exists()) {
      throw new Error("Menu not found");
    }

    const menuData = menuDocSnapshot.data();
    const lifetimeViews = menuData.lifetimeViews || 0;

    const updatedViews = lifetimeViews + 1;

    await updateDoc(menuDocRef, {
      lifetimeViews: updatedViews,
      lastViewedAt: serverTimestamp(),
    });

    console.log("Menu views increased successfully");
  } catch (error) {
    console.log("Error increasing menu views: ", error);
    throw error;
  }
};

export const editProductImage = async (
  menuId: string,
  categoryName: string,
  productId: string,
  formData: FormData
): Promise<MenuType | null> => {
  console.log("edit product image");

  try {
    // Get the menu document
    const menuDocRef = doc(db, "menus", menuId);
    const menuDocSnapshot = await getDoc(menuDocRef);

    if (!menuDocSnapshot.exists()) {
      throw new Error("Menu not found");
    }

    // Get the menu data
    const menuData = menuDocSnapshot.data() as MenuType;
    const categories = menuData.categories || [];

    // Find the category
    const categoryIndex = categories.findIndex(
      (cat) => cat.name === categoryName
    );
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }

    // Find the product
    const productIndex = categories[categoryIndex].products.findIndex(
      (prod) => prod._id === productId
    );
    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    const product = categories[categoryIndex].products[productIndex];

    // Upload new image to Firebase Storage
    const file: File = formData.get("productPicture") as File;
    if (file) {
      const storageRef = ref(
        storage,
        `menus/${menuId}/products/${file.name}`
      );
      
      console.log("Uploading file:", file.name);
      const uploadResult = await uploadBytes(storageRef, file);
      console.log("Upload completed:", uploadResult);

      console.log("Getting download URL");
      const newImageUrl = await getDownloadURL(storageRef);
      console.log("New image URL:", newImageUrl);

      // Update product image
      product.image = newImageUrl;

      // Update the categories array
      categories[categoryIndex].products[productIndex] = product;

      // Update menu document
      console.log("Updating Firestore document");
      await updateDoc(menuDocRef, {
        categories: categories,
        lastModifiedAt: serverTimestamp(),
      });

      // Delete old image from Firebase Storage if it exists
      if (product.image && product.image !== newImageUrl) {
        console.log("Attempting to delete old image:", product.image);
        try {
          const oldImageRef = ref(storage, product.image);
          await deleteObject(oldImageRef);
          console.log("Old image deleted successfully");
        } catch (deleteError) {
          console.log("Error deleting old image: ", deleteError);
        }
      }
    } else {
      console.log("No new file provided");
    }

    // Fetch the updated menu
    const updatedMenuSnapshot = await getDoc(menuDocRef);
    const updatedMenuData = updatedMenuSnapshot.data() as MenuType;

    // Return the entire updated menu
    return jsonify(updatedMenuData);
  } catch (error) {
    console.log("Error editing product image: ", error);
    throw error;
  }
};

export const editProduct = async (
  menuId: string,
  categoryName: string,
  productId: string,
  editedProduct: ProductType
) => {
  try {
    // Get the menu document
    const menuDocRef = doc(db, "menus", menuId);
    const menuDocSnapshot = await getDoc(menuDocRef);

    if (!menuDocSnapshot.exists()) {
      throw new Error("Menu not found");
    }

    // Get the menu data
    const menuData = menuDocSnapshot.data();
    const categories = menuData.categories || [];

    // Find the category
    const categoryIndex = categories.findIndex(
      (cat: { name: string }) => cat.name === categoryName
    );
    if (categoryIndex === -1) {
      throw new Error("Category not found");
    }

    const category = categories[categoryIndex];

    // Find the product
    const productIndex = category.products.findIndex(
      (prod: { _id: string }) => prod._id === productId
    );
    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    const product = category.products[productIndex];

    // Update product data
    product.name = editedProduct.name;
    product.description = editedProduct.description;
    product.price = editedProduct.price;
    product.isReduced = editedProduct.isReduced;
    product.reducedPrice = editedProduct.reducedPrice;
    product.isDiscountProcentual = editedProduct.isDiscountProcentual;
    product.allergens = editedProduct.allergens;
    product.nutritionalValues = editedProduct.nutritionalValues;

    // Update the category in the menu data
    categories[categoryIndex] = category;

    // Update menu document
    await updateDoc(menuDocRef, {
      categories: categories,
      lastModifiedAt: serverTimestamp(),
    });

    // Return the updated menu data
    const updatedMenuSnapshot = await getDoc(menuDocRef);
    const updatedMenuData = updatedMenuSnapshot.data();
    return jsonify(updatedMenuData);
  } catch (error) {
    console.log("Error editing product: ", error);
    throw error;
  }
};

export const editProductAndImage = async (
  menuId: string,
  categoryName: string,
  productId: string,
  editedProduct: ProductType,
  formData: FormData
) => {
  try {
    // Get the menu document
    const menuDocRef = doc(db, "menus", menuId);
    const menuDocSnapshot = await getDoc(menuDocRef);

    if (!menuDocSnapshot.exists()) {
      throw new Error("Menu not found");
    }

    // Get the menu data
    const menuData = menuDocSnapshot.data();
    const categories = menuData.categories || [];

    // Find the category
    const category = categories.find(
      (cat: { name: string }) => cat.name === categoryName
    );
    if (!category) {
      throw new Error("Category not found");
    }

    // Find the product
    const product = category.products.find(
      (prod: { _id: string }) => prod._id === productId
    );
    if (!product) {
      throw new Error("Product not found");
    }

    const utapi = new UTApi();
    let existingImageFilename = product.image.replace("https://utfs.io/f/", "");

    // Upload new image
    const file: File = formData.get("productPicture") as File;
    const uploadNewImageResponse = await utapi.uploadFiles([file]);

    let newImageUrl;

    if (uploadNewImageResponse[0]?.data?.url) {
      newImageUrl = uploadNewImageResponse[0].data.url;
    }

    // Delete existing image
    await utapi.deleteFiles([existingImageFilename]);

    // Update product data and image URL
    product.name = editedProduct.name;
    product.description = editedProduct.description;
    product.price = editedProduct.price;
    product.isReduced = editedProduct.isReduced;
    product.reducedPrice = editedProduct.reducedPrice;
    product.isDiscountProcentual = editedProduct.isDiscountProcentual;
    product.allergens = editedProduct.allergens;
    product.image = newImageUrl;

    // Update menu document
    await updateDoc(menuDocRef, {
      categories: categories,
      lastModifiedAt: serverTimestamp(),
    });

    // Return the updated product
    return jsonify(product);
  } catch (error) {
    console.log("Error editing product and image: ", error);
    throw error;
  }
};
export const callWaiter = async (
  menuId: string,
  tableNumber: number,
  action: boolean
) => {
  try {
    // Get the menu document
    const menuDocRef = doc(db, "menus", menuId);
    const menuDocSnapshot = await getDoc(menuDocRef);

    if (!menuDocSnapshot.exists()) {
      throw new Error("Menu not found");
    }

    // Get the menu data
    const menuData = menuDocSnapshot.data();
    const tables = menuData.tables || [];

    // Find the table
    const table = tables.find(
      (table: any) => table.tableNumber === tableNumber
    );
    if (!table) {
      throw new Error("Table not found");
    }

    // Update call waiter action
    table.callWaiter = action;

    // Update menu document
    await updateDoc(menuDocRef, {
      tables: tables,
      lastModifiedAt: serverTimestamp(),
    });

    // Return the updated menu
    return jsonify(menuData);
  } catch (error) {
    console.log("Error calling waiter: ", error);
    throw error;
  }
};
export const requestBill = async (
  menuId: string,
  tableNumber: number,
  action: boolean
) => {
  try {
    // Get the menu document
    const menuDocRef = doc(db, "menus", menuId);
    const menuDocSnapshot = await getDoc(menuDocRef);

    if (!menuDocSnapshot.exists()) {
      throw new Error("Menu not found");
    }

    // Get the menu data
    const menuData = menuDocSnapshot.data();
    const tables = menuData.tables || [];

    // Find the table
    const table = tables.find(
      (table: any) => table.tableNumber === tableNumber
    );
    if (!table) {
      throw new Error("Table not found");
    }

    // Update request bill action
    table.requestBill = action;

    // Update menu document
    await updateDoc(menuDocRef, {
      tables: tables,
      lastModifiedAt: serverTimestamp(),
    });

    // Return the updated menu
    return jsonify(menuData);
  } catch (error) {
    console.log("Error requesting bill: ", error);
    throw error;
  }
};

export const getTables = async (menuId: string) => {
  try {
    // Get the menu document
    const menuDocRef = doc(db, "menus", menuId);
    const menuDocSnapshot = await getDoc(menuDocRef);

    if (!menuDocSnapshot.exists()) {
      throw new Error("Menu not found");
    }

    // Extract tables from menu data
    const menuData = menuDocSnapshot.data();
    const tables = menuData.tables || [];

    return jsonify(tables);
  } catch (error) {
    console.log("Error getting tables: ", error);
    throw error;
  }
};

export const sendUserOrder = async (menuId: string, tableNumber: string, userName: string, order: any[]) => {
  try {
    const menuRef = doc(db, 'menus', menuId);
    const menuDoc = await getDoc(menuRef);

    if (!menuDoc.exists()) {
      throw new Error('Menu not found');
    }

    const menuData = menuDoc.data();
    const tables = menuData.tables || [];
    const tableIndex = tables.findIndex((table: any) => table.tableNumber === parseInt(tableNumber));

    if (tableIndex === -1) {
      throw new Error('Table not found');
    }

    const newOrder = {
      user: userName,
      order: [...order],
      // timestamp: serverTimestamp(), TODO: FIX THIS
      status: 'pending'
    };

    if (!tables[tableIndex].orders) {
      tables[tableIndex].orders = [];
    }

    tables[tableIndex].orders.push(newOrder);

    await updateDoc(menuRef, { tables: tables });

    return { success: true };
  } catch (error) {
    console.error('Error sending order:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
};