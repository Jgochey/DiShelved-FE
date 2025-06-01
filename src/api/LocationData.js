import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

const getLocationsByUserUid = async (Uid) => {
  const response = await fetch(`${endpoint}/Locations/UserUid/${Uid}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await response.json();
  return data || [];
};

const getLocationById = (locationId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/Locations/${locationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          resolve(data);
        } else {
          resolve(null);
        }
      })
      .catch(reject);
  });

const updateLocation = (locationId, locationData) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/Locations/${locationId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          resolve(data);
        } else {
          resolve(null);
        }
      })
      .catch(reject);
  });

const deleteLocation = (locationId) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/Locations/${locationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(reject);
  });

const createLocation = (locationData) =>
  new Promise((resolve, reject) => {
    fetch(`${endpoint}/Locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(locationData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          resolve(data);
        } else {
          resolve(null);
        }
      })
      .catch(reject);
  });

export { getLocationsByUserUid, getLocationById, updateLocation, deleteLocation, createLocation };
