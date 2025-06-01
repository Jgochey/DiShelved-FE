import { clientCredentials } from '../utils/client';

const endpoint = clientCredentials.databaseURL;

export const getUsers = async () => {
  const response = await fetch(`${endpoint}/Users`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  return data ? Object.values(data) : [];
};

export const getUserById = async (userId) => {
  const response = await fetch(`${endpoint}/Users/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  return data || null;
};

export const createUser = async (userData) => {
  const response = await fetch(`${endpoint}/Users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return data || null;
};
