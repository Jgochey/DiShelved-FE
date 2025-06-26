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

const getItemsByUserId = (userId) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Items/User/${userId}`, {
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

const getItemsByContainerId = (containerId) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Items/Container/${containerId}`, {
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

const getSingleItem = (id) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Items/${id}`, {
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

const searchItems = (userId, query) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Items/${userId}/Search/${query}`, {
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

const updateItem = (id, itemData) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Items/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        });
        const data = await response.json();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    })();
  });

const moveItem = (id) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Items/Move/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          reject(new Error('Failed to move item'));
          return;
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    })();
  });

const createItem = (itemData) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Items`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(itemData),
        });
        const data = await response.json();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    })();
  });

const deleteItem = (id) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Items/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          reject(new Error('Failed to delete item'));
          return;
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    })();
  });

export { getItemsByUserId, getSingleItem, getItemsByContainerId, searchItems, updateItem, moveItem, createItem, deleteItem };
