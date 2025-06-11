import firebase from 'firebase/app';
import 'firebase/auth';
import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

// Helper to get the current user's token. This will be used to authenticate requests to the API.
const getToken = async () => {
  const user = firebase.auth().currentUser;
  if (user) {
    return user.getIdToken();
  }
  return null;
};

const getItemCategory = (itemId, categoryId) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/ItemCategory/${itemId}/${categoryId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        resolve(data || null);
      } catch (error) {
        reject(error);
      }
    })();
  });

const getItemCategoriesByItemId = (itemId) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/ItemCategory/Item/${itemId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        resolve(data || null);
      } catch (error) {
        reject(error);
      }
    })();
  });

const createItemCategory = (itemId, categoryId) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/ItemCategory/${itemId}/${categoryId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ itemId, categoryId }),
        });
        const data = await response.json();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    })();
  });

const deleteItemCategory = (itemId, categoryId) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/ItemCategory/${itemId}/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const text = await response.text();
        const data = text ? JSON.parse(text) : null;
        resolve(data);
      } catch (error) {
        reject(error);
      }
    })();
  });

export { getItemCategory, getItemCategoriesByItemId, createItemCategory, deleteItemCategory };
