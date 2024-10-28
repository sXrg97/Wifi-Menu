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
  formData: FormData,
  orderFromMenu: boolean
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
      orderFromMenu: Boolean(orderFromMenu)
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

export const sendUserOrder = async (menuId: string, tableNumber: string, userName: string, order: any[], totalPrice: string) => {
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

    const id = userName + new Date().getTime();

    const newOrder = {
      user: userName,
      order: [...order],
      totalPrice,
      // timestamp: serverTimestamp(), TODO: FIX THIS
      status: 'pending',
      id 
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

export const updateOrderStatusInDB = async (
  menuId: string,
  tableNumber: number,
  orderId: string,
) => {
  try {
    const menuRef = doc(db, "menus", menuId);
    const menuSnapshot = await getDoc(menuRef);

    if (!menuSnapshot.exists()) {
      throw new Error("Menu not found");
    }

    const menuData = menuSnapshot.data();
    const tables = menuData.tables || [];
    const tableIndex = tables.findIndex((table: any) => table.tableNumber === tableNumber);
    
    if (tableIndex === -1) {
      throw new Error("Table not found");
    }

    const orders = tables[tableIndex].orders || [];
    const orderIndex = orders.findIndex((order: any) => order.id === orderId);

    if (orderIndex === -1) {
      throw new Error("Order not found");
    }

    const currentStatus = orders[orderIndex].status;

    // Update the order status based on the current status
    if (currentStatus === 'pending') {
      orders[orderIndex].status = 'preparing';
    } else if (currentStatus === 'preparing') {
      orders[orderIndex].status = 'delivered';
    }

    // Update the menu document with the new orders array
    await updateDoc(menuRef, {
      tables: tables,
      lastModifiedAt: serverTimestamp(),
    });

    return { success: true, updatedOrder: orders[orderIndex] };
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

export const setNewMenuDb = async (menuId: string) => {
  const menuRef = doc(db, "menus", menuId);
  const menuSnapshot = await getDoc(menuRef);

  if (!menuSnapshot.exists()) {
    console.log("Menu not found");
    return null;
  }

  // Set the menu categories to an empty array
  await updateDoc(menuRef, {
    categories: [
      {
          "products": [
              {
                  "isDiscountProcentual": false,
                  "nutritionalValues": "123 kcal, 5 g proteine, 6 g lipide, 11 g carbohidrati, 10 g zahar, 95 mg sodiu, 30 mg cofeina",
                  "allergens": [
                      "Milk"
                  ],
                  "description": "Cappuccino 120ml",
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Cappuccino_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727155608106.png?alt=media&token=a961749d-5581-42a3-a88a-c8ab74cf7e71",
                  "name": "Cappuccino",
                  "price": 15,
                  "reducedPrice": 0,
                  "_id": "7a001e01-8e20-4b05-af02-9deab98eeaec",
                  "isReduced": false
              },
              {
                  "nutritionalValues": "21 kcal, 0.5 g proteine, 0 g carbohidrati, 2 g lipide",
                  "isReduced": false,
                  "allergens": [],
                  "_id": "cb118093-9c45-4936-9050-0239aa94dc74",
                  "price": 9.5,
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Expresso_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727189753547.png?alt=media&token=4d36f11e-0ff7-43d9-aa10-6e0a07869dae",
                  "name": "Expresso",
                  "description": "Espresso 40ml",
                  "isDiscountProcentual": false,
                  "reducedPrice": 0
              },
              {
                  "allergens": [
                      "Milk"
                  ],
                  "nutritionalValues": "15 g carbohidrati, 10 g grasimi, 5 g proteine, 180 kcal.",
                  "_id": "edc19a7f-45b0-4dd0-9e55-c6f7d387c5b0",
                  "name": "Latte Macchiato",
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Latte%20Macchiato_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727189983492.png?alt=media&token=268886bd-970d-444a-abc8-90223ea22d86",
                  "price": 15,
                  "isDiscountProcentual": false,
                  "isReduced": false,
                  "description": "Latte Macchiato 150ml",
                  "reducedPrice": 0
              },
              {
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Americano_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727190182839.png?alt=media&token=db84cd04-40fb-4396-b357-4b4e094aaf10",
                  "isReduced": false,
                  "_id": "1958ee55-66e3-4c5f-872f-610de169be75",
                  "name": "Americano",
                  "price": 11,
                  "nutritionalValues": "2 kcal, 0.3g proteine, 0.1g lipide, 0g carbohidrati",
                  "allergens": [],
                  "description": "Cafea lunga 100ml",
                  "reducedPrice": 0,
                  "isDiscountProcentual": false
              }
          ],
          "name": "Cafea"
      },
      {
          "name": "Bauturi racoritoare",
          "products": [
              {
                  "description": "Coca Cola 330ml",
                  "allergens": [],
                  "_id": "fde81df6-f606-4707-8439-a1260dd41575",
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Coca%20Cola_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727190516528.png?alt=media&token=68c61bde-c626-413d-91a8-d3f40cf74c11",
                  "reducedPrice": 0,
                  "name": "Gama Coca Cola (Coca Cola Zero, Sprite, Fanta)",
                  "nutritionalValues": "138 kcal, 0g proteine, 0g lipide, 35g carbohidrati, 35g zahar, 0g fibre",
                  "isReduced": false,
                  "price": 11,
                  "isDiscountProcentual": false
              },
              {
                  "description": "Suc de portocale 200ml",
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Fresh%20de%20portocale_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727190819082.png?alt=media&token=7c166d5c-6f5c-4320-b3c3-1c6234daad6a",
                  "reducedPrice": 0,
                  "isDiscountProcentual": false,
                  "_id": "75881189-d7df-430a-b028-6df456fcd3c2",
                  "nutritionalValues": "155 kcal, 1.7g proteine, 0.5g lipide, 38g carbohidrati, 0.5g fibre",
                  "isReduced": false,
                  "name": "Fresh de portocale",
                  "price": 18,
                  "allergens": []
              },
              {
                  "name": "Limonada",
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Limonada_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727190948139.png?alt=media&token=e3968def-c261-4463-8266-c3e349f49af3",
                  "nutritionalValues": "80 kcal, 0g proteine, 0g lipide, 20g carbohidrati, 10g zahar.",
                  "reducedPrice": 0,
                  "_id": "1a35de13-8dc2-49ae-8ec9-61f93cfbf65b",
                  "isReduced": false,
                  "isDiscountProcentual": false,
                  "description": "Limonada 250ml cu zahar 10g",
                  "allergens": [],
                  "price": 18
              },
              {
                  "_id": "7c39f565-3e46-4a06-a9ce-11e85af3a4cf",
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2FCapsuni)_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727191328269.png?alt=media&token=7a2ff7fe-5ff2-4a52-b87d-c55445a41c97",
                  "description": "Smoothies ciocolata 300ml",
                  "isReduced": true,
                  "reducedPrice": 15,
                  "price": 25,
                  "name": "Smoothies (Ciocolata/Piersica/Capsuni)",
                  "allergens": [
                      "Milk"
                  ],
                  "nutritionalValues": "310 kcal, 6g proteine, 10g lipide, 45g carbohidrati, 3g fibre",
                  "isDiscountProcentual": true
              }
          ]
      },
      {
          "products": [
              {
                  "description": "Gramaj total per portie 450g: Blat de pizza 200g, sos de rosii 20g, salam 150g, mozzarella 80g",
                  "reducedPrice": 0,
                  "name": "Pizza Salami ",
                  "isDiscountProcentual": false,
                  "allergens": [
                      "Gluten",
                      "Milk"
                  ],
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Pizza%20Salami_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727191771196.png?alt=media&token=4f7b5d50-07ca-4283-922d-6deabcdfc147",
                  "nutritionalValues": "720 kcal, 32g proteine, 30g lipide, 65g carbohidrati, 6g fibre",
                  "isReduced": false,
                  "price": 48,
                  "_id": "3093d102-4e79-479b-befc-99132ad2be9b"
              },
              {
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Pizza%20Vegetariana_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727191859262.png?alt=media&token=7b5bfe95-0424-480f-8fcf-c46722643331",
                  "nutritionalValues": "690 kcal, 29g proteine, 24g lipide, 89g carbohidrati, 8g fibre.",
                  "allergens": [
                      "Gluten",
                      "Milk"
                  ],
                  "isDiscountProcentual": false,
                  "_id": "d928fa37-96a6-4f90-8f12-9153fec2cc48",
                  "description": "Gramaj total per portie 400g: Blat de pizza 200g, sos rosii 20g, porumb 20g, ciuperci 20g, masline 20g, ardei gras 20g, ceapa 20g, mozarella 80g.",
                  "name": "Pizza Vegetariana ",
                  "isReduced": false,
                  "price": 40,
                  "reducedPrice": 0
              },
              {
                  "isDiscountProcentual": true,
                  "nutritionalValues": "905 kcal, 54g proteine, 41g lipide, 72g carbohidrati, 6g fibre.",
                  "allergens": [
                      "Gluten",
                      "Eggs"
                  ],
                  "_id": "0b912f7e-20a7-4652-8a09-74a27fa16daf",
                  "isReduced": true,
                  "name": "Pizza Casei ",
                  "description": "Gramaj total per portie 540g: Blat de pizza 200g, sos de rosii 20g, porumb 20g, ciuperci 20g, masline 20g, salam 70g, muschi de porc 70g, carnaciori afumati 70g, mozzarella 50g.",
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Pizza%20Casei%20540g_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727192209051.png?alt=media&token=bd72b99e-68d7-4b00-82e2-d67abc226129",
                  "reducedPrice": 10,
                  "price": 55
              },
              {
                  "_id": "0235afe5-c210-461c-9301-1e53374871b5",
                  "isDiscountProcentual": false,
                  "allergens": [
                      "Gluten",
                      "Milk"
                  ],
                  "description": "Gramaj total per portie 400g: Blat de pizza 200g, sos de rosii 20g, rucola 20g, rosii 60g, burrata 100g",
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Pizza%20Burrata%20400g_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727192649024.png?alt=media&token=78c1ab94-9f3e-49a7-b441-869a1e0960bd",
                  "name": "Pizza Burrata ",
                  "nutritionalValues": "570 kcal, 33g proteine, 23g lipide, 59g carbohidrati, 2g fibre",
                  "reducedPrice": 13,
                  "price": 50,
                  "isReduced": false
              }
          ],
          "name": "Pizza"
      },
      {
          "name": "Paste",
          "products": [
              {
                  "name": "Paste Carbonara ",
                  "nutritionalValues": "870 kcal, 39g proteine, 33g lipide, 98g carbohidrati, 6g fibre.",
                  "reducedPrice": 0,
                  "price": 32,
                  "isDiscountProcentual": false,
                  "isReduced": false,
                  "description": "Gramaj total per portie 225g: Spaghete 100g, ou 30g, pecorino 40g, guanciale 50g, piper negru 5g.",
                  "_id": "a3099e00-ca7b-4d47-b072-880784185364",
                  "allergens": [
                      "Eggs",
                      "Gluten",
                      "Milk"
                  ],
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Paste%20carbonara%20310g_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727193223568.png?alt=media&token=70292f8b-6234-4750-a645-1ce66137ee20"
              },
              {
                  "reducedPrice": 0,
                  "price": 33,
                  "name": "Paste Bolognese",
                  "_id": "cb8f2f5c-3510-48cc-8d23-e6a1645cf740",
                  "isReduced": false,
                  "description": "Gramaj total per porție: 290g. Tagliatelle 100g, carne de vită 80g, sos de roșii 60g, ceapă 20g, morcov 20g, ulei de măsline 10g",
                  "isDiscountProcentual": false,
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Paste%20Bolognese_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727193852030.png?alt=media&token=cafb1c63-8aa3-4b26-b4c5-59e953337b5b",
                  "nutritionalValues": "550 kcal, 26g proteine, 15g lipide, 79g carbohidrați, 4g fibre",
                  "allergens": [
                      "Gluten"
                  ]
              },
              {
                  "_id": "2a6f20ef-d76d-4b5c-a6ef-af34f5becd2d",
                  "isDiscountProcentual": false,
                  "price": 29,
                  "isReduced": false,
                  "reducedPrice": 0,
                  "allergens": [
                      "Gluten",
                      "Milk",
                      "Nuts"
                  ],
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Paste%20Pesto_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727194072801.png?alt=media&token=329d073b-6b14-4bf2-baab-49fc8e4d16aa",
                  "nutritionalValues": "685 kcal, 24g proteine, 40g lipide, 50g carbohidrați",
                  "name": "Paste Pesto",
                  "description": "Gramaj total per porție: 190g. Fusilli 100g, busuioc proaspăt 30g, parmezan 30g, ulei de măsline 20g, nuci pin 10g"
              },
              {
                  "allergens": [
                      "Gluten",
                      "Milk"
                  ],
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Paste%20Primavera_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727194259948.png?alt=media&token=fe4f2df6-4473-4502-adbe-e34069811850",
                  "price": 30,
                  "nutritionalValues": "250 kcal, 7g proteine, 12g lipide, 25g carbohidrați, 4g fibre",
                  "name": "Paste Primavera",
                  "isReduced": true,
                  "description": "Gramaj total per porție: 250g. Farfalle 100g, roșii cherry 50g, dovlecel 40g, ardei gras 30g, parmezan 20g, ulei de măsline 10g",
                  "isDiscountProcentual": true,
                  "reducedPrice": 10,
                  "_id": "7d52b7f7-a7d1-4b23-ae31-6f2505bb79da"
              }
          ]
      },
      {
          "products": [
              {
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Papanasi_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727194620646.png?alt=media&token=aa0ad9a3-a450-48b6-a7e4-ec65227795ec",
                  "description": "Gramaj total per porție: 415g. Brânză de vaci 150g, făină 100g, ouă 50g, zahăr 30g, praf de copt 5g, smântână 50g, dulceață de afine 30g",
                  "price": 29,
                  "allergens": [
                      "Gluten",
                      "Milk",
                      "Eggs"
                  ],
                  "_id": "77c52825-8746-4ac2-bc43-68b4da3c0f4e",
                  "reducedPrice": 0,
                  "isReduced": false,
                  "isDiscountProcentual": false,
                  "nutritionalValues": "460 kcal, 22g proteine, 12g lipide, 68g carbohidrați, 278mg sodiu",
                  "name": "Papanasi"
              },
              {
                  "isReduced": false,
                  "nutritionalValues": "420 kcal, 6g proteine, 35g lipide, 18g carbohidrați, 3g fibre",
                  "allergens": [
                      "Milk"
                  ],
                  "_id": "6b0cbef4-ea13-4a6c-966e-d51c0314f82b",
                  "name": "Panna cotta cu fructe de padure",
                  "reducedPrice": 0,
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Panna%20cotta%20cu%20fructe%20de%20padure_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727194867728.png?alt=media&token=07a931e8-cdfb-4370-a9cc-d6c84413faff",
                  "isDiscountProcentual": false,
                  "description": "Gramaj total per porție: 255g. Smântână dulce 150g, zahăr 40g, gelatină 5g, fructe de pădure 60g",
                  "price": 22
              },
              {
                  "price": 25,
                  "isReduced": false,
                  "nutritionalValues": "565 kcal, 11g proteine, 32g lipide, 53g carbohidrați, 2g fibre",
                  "name": "Tiramisu",
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Tiramisu_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727194978160.png?alt=media&token=a0d1e311-32d2-438d-a9f1-7a08b75091ed",
                  "allergens": [
                      "Gluten",
                      "Eggs",
                      "Milk"
                  ],
                  "_id": "f770d61b-a719-4aa4-bf3f-8df034e16c70",
                  "isDiscountProcentual": false,
                  "description": "Gramaj total per porție: 305g. Pișcoturi 100g, mascarpone 80g, ouă 40g, zahăr 30g, cafea espresso 50ml, cacao 5g",
                  "reducedPrice": 0
              },
              {
                  "reducedPrice": 10,
                  "isReduced": true,
                  "price": 25,
                  "nutritionalValues": "393 kcal, 5.4g proteine, 18.6g lipide, 52.8g carbohidrați, 21g zahăr",
                  "isDiscountProcentual": true,
                  "image": "https://firebasestorage.googleapis.com/v0/b/wifi-menu-ro.appspot.com/o/menus%2F4T93KbXXCryjYJCUEgom%2Fproducts%2Fproduct_picture_Cheesecake%20cu%20ciocolata_user_2mLOJsy47juNvHBlro6Hno0QYkp_1727195140985.png?alt=media&token=e128dc99-39c9-4895-9b97-9e744ddb3ef5",
                  "name": "Cheesecake cu ciocolata",
                  "description": "Gramaj total per porție: 340g. Biscuiți digestivi 100g, cremă de brânză 120g, ciocolată 50g, unt 30g, zahăr 40g",
                  "_id": "98575fb2-566b-46e7-a0f8-57a2ecfc78cc",
                  "allergens": [
                      "Gluten",
                      "Milk"
                  ]
              }
          ],
          "name": "Desert"
      }
  ] // This line sets the categories to an empty array
  });

  console.log("Menu categories have been set to an empty array");
}