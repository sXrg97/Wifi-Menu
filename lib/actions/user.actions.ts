"use server";
import { db } from '@/utils/firebase';
import { collection, doc, getDoc, addDoc, updateDoc, query, where, getDocs } from 'firebase/firestore';

export const checkUserOrCreate = async (clerkUserId: string, email: string) => {
  if (!clerkUserId) return null;

  try {
    const usersRef = collection(db, 'users');
    const userQuery = query(usersRef, where('clerkUserId', '==', clerkUserId));
    const userSnapshot = await getDocs(userQuery);

    if (!userSnapshot.empty) {
      // User with clerkUserId exists, return its menu id
      return userSnapshot.docs[0].data().menu.id;
    } else {
      // User does not exist, create a new menu and user
      const menusRef = collection(db, 'menus');
      const menuDoc = await addDoc(menusRef, {
        owner: doc(usersRef, clerkUserId),
        restaurantName: 'My Restaurant',
        isLive: false,
        categories: [],
        lifetimeViews: 0,
        tables: [{ tableNumber: 1, callWaiter: false, requestBill: false }],
      }).catch((error) => {
        console.error('Error creating menu document:', error);
        throw error;
      });

      if (!menuDoc.id) {
        console.error('Failed to create menu document, menuDoc.id is null');
        return null;
      }

      // Update the menu document to add the _id field
      await updateDoc(doc(menusRef, menuDoc.id), {
        _id: menuDoc.id,
        slug: menuDoc.id.toLowerCase(),
      });


      const userDoc = await addDoc(usersRef, {
        clerkUserId: clerkUserId,
        email: email,
        name: '',
        image: '',
        menu: doc(menusRef, menuDoc.id),
      }).catch((error) => {
        console.error('Error creating user document:', error);
        throw error;
      });

      if (!userDoc.id) {
        console.error('Failed to create user document, userDoc.id is null');
        return null;
      }

      // Update the menu to set the owner to the newly created user
      await updateDoc(doc(menusRef, menuDoc.id), {
        owner: doc(usersRef, userDoc.id),
      });

      return menuDoc.id;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};