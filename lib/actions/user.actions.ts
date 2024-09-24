"use server";
import { db } from '@/utils/firebase';
import { collection, doc, getDoc, addDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { jsonify } from '../utils';

export const checkUserOrCreate = async (clerkUserId: string, email: string) => {
  if (!clerkUserId) return null;

  try {
    const usersRef = collection(db, 'users');
    const userQuery = query(usersRef, where('clerkUserId', '==', clerkUserId));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      // User with clerkUserId exists, return its menu id if it exists
      const userData = userSnapshot.docs[0].data();
      return userData.menu ? userData.menu.id : null;
    } else {
      // User does not exist, create a new user without a menu
      const userDoc = await addDoc(usersRef, {
        clerkUserId: clerkUserId,
        email: email,
        name: '',
        image: '',
        menu: null, // We'll set this later when creating the menu
      });

      if (!userDoc.id) {
        console.error('Failed to create user document, userDoc.id is null');
        return null;
      }

      // Return null to indicate that we need to create a menu
      return null;
    }
  } catch (error) {
    console.error('Error in checkUserOrCreate:', error);
    return null;
  }
};

export async function getUserDocumentRefsByClerkUserId(clerkUserId: string) {
  try {
    const userQuery = query(collection(db, "users"), where("clerkUserId", "==", clerkUserId));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      
      // Get the Firestore docref for the user
      const userDocRef = userDoc.ref;
      
      // Assuming menu is a field that contains a path like "/menus/menuId"
      const menuDocRef = userDoc.data().menu;
      
      return {
        userDocRef,
        menuDocRef,
      };
    } else {
      console.error(`User with clerkUserId ${clerkUserId} not found.`);
      return null;
    }
  } catch (error) {
    console.error('Error in getUserDocumentRefsByClerkUserId:', error);
    return null;
  }
}
