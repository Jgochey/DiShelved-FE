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

const getCategoriesByUserId = (userId) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Categories/User/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        resolve(data || []);
      } catch (error) {
        reject(error);
      }
    })();
  });

const getCatergoriesByUserUid = (Uid) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Categories/UserUid/${Uid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        resolve(data || []);
      } catch (error) {
        reject(error);
      }
    })();
  });

const getCategoryById = (categoryId) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Categories/${categoryId}`, {
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

const updateCategory = (categoryId, categoryData) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Categories/${categoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(categoryData),
        });
        if (response.ok) {
          resolve();
        } else {
          reject(new Error('Failed to update category'));
        }
      } catch (error) {
        reject(error);
      }
    })();
  });

const deleteCategory = (categoryId) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Categories/${categoryId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          reject(new Error(errorData.message || 'Failed to delete category'));
          return;
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    })();
  });

const createCategory = (categoryData) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(categoryData),
        });
        const data = await response.json();
        resolve(data || null);
      } catch (error) {
        reject(error);
      }
    })();
  });

export { getCategoriesByUserId, getCatergoriesByUserUid, getCategoryById, updateCategory, deleteCategory, createCategory };
