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

const getContainerById = (containerId) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Containers/${containerId}`, {
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

const getContainersByUserId = (userId) =>
  new Promise((resolve, reject) => {
    const user = firebase.auth().currentUser;
    if (!user || user.uid !== userId) {
      reject(new Error('Unauthorized access: User ID does not match.'));
      return;
    }
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Containers/User/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          // If not found or error, resolve with empty array
          resolve([]);
          return;
        }
        const data = await response.json();
        // If there are no containers in the response, return an empty array
        if (!data || Object.keys(data).length === 0) {
          resolve([]);
          return;
        }
        resolve(data || []);
      } catch (error) {
        reject(error);
      }
    })();
  });

const getContainersByLocationId = (locationId) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const user = firebase.auth().currentUser;
        if (!user) {
          reject(new Error('Unauthorized access: User not authenticated.'));
          return;
        }
        const token = await getToken();
        const response = await fetch(`${endpoint}/Containers/Location/${locationId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          // If not found or error, resolve with empty array
          resolve([]);
          return;
        }
        const data = await response.json();
        // If there are no containers in the response, return an empty array
        if (!data || Object.keys(data).length === 0) {
          resolve([]);
          return;
        }
        resolve(data || []);
      } catch (error) {
        reject(error);
      }
    })();
  });

const updateContainer = (containerId, containerData) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Containers/${containerId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(containerData),
        });
        const data = await response.json();
        resolve(data || null);
      } catch (error) {
        reject(error);
      }
    })();
  });

const deleteContainer = (containerId) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Containers/${containerId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          // Try to parse the error message from the response
          const errorData = await response.json().catch(() => ({}));
          reject(new Error(errorData.message || 'Failed to delete container'));
          return;
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    })();
  });

const createContainer = (containerData) =>
  new Promise((resolve, reject) => {
    (async () => {
      try {
        const token = await getToken();
        const response = await fetch(`${endpoint}/Containers`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(containerData),
        });
        const data = await response.json();
        resolve(data || null);
      } catch (error) {
        reject(error);
      }
    })();
  });

export { getContainerById, getContainersByUserId, getContainersByLocationId, updateContainer, deleteContainer, createContainer };
