'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/utils/context/authContext';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import Link from 'next/link';
import { getItemsByUserId, searchItems } from '../../../api/ItemData';
import { getUserByUid } from '../../../api/UserData';
import { getCatergoriesByUserUid } from '../../../api/CategoryData';
import { getContainersByUserId } from '../../../api/ContainerData';

export default function SearchPage({ params }) {
  const { query } = params; // Extract the query from the URL parameters
  const [searchResults, setSearchResults] = useState([]);
  const { user } = useAuth();
  const [containers, setContainers] = useState([]);

  const setUserItems = async () => {
    if (user && user.uid) {
      try {
        const userObj = await getUserByUid(user.uid);

        const data = await getItemsByUserId(userObj.id);
        if (!data || Object.keys(data).length === 0) {
          console.warn('No items found for this user. Please add items first.');
        }
      } catch (error) {
        console.error('Error fetching user items:', error);
      }
    }
  };

  const setUserCategories = () => {
    if (user && user.uid) {
      getCatergoriesByUserUid(user.uid).then((data) => {
        if (!data || Object.keys(data).length === 0) {
          console.warn('No categories found for this user. Please add categories first.');
        }
      });
    }
  };

  // Fetch containers for the user
  const setUserContainers = async () => {
    if (user && user.uid) {
      try {
        const userObj = await getUserByUid(user.uid);
        if (userObj && userObj.id) {
          const data = await getContainersByUserId(userObj.id);
          if (!data || Object.keys(data).length === 0) {
            setContainers([]);
          } else {
            setContainers(Array.isArray(data) ? data : []);
          }
        }
      } catch (error) {
        setContainers([]);
      }
    }
  };

  useEffect(() => {
    setUserItems();
    setUserCategories();
    setUserContainers(); // Add this
  }, [user]);

  const getSearchResults = async () => {
    if (user && user.uid) {
      try {
        const userObj = await getUserByUid(user.uid);
        if (!userObj || !userObj.id) {
          setSearchResults([]);
          return;
        }

        const results = await searchItems(userObj.id, query);
        console.log('searchItems results:', results); // <-- Remove this console.log later

        let items = Array.isArray(results) ? results : [];
        // If items are just IDs, fetch full data for each
        if (items.length && typeof items[0] === 'string') {
          items = await Promise.all(items.map((id) => getItemsByUserId(userObj.id).then((all) => all.find((i) => i.id === id))));
        }
        setSearchResults(items);
      } catch (error) {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    getSearchResults();
  }, [user, query]);

  return (
    <div>
      <h1>Search Results for: {query}</h1>
      <div>
        {searchResults.map((result, idx) => {
          const item = result.item || result;
          const itemCategories = result.categories || [];
          const container = containers.find((c) => c.id === item.containerId);

          return (
            <Card
              className="savedItemcard"
              key={item.id || idx}
              style={{
                background: '#305bab',
                margin: '1rem auto',
                padding: '1rem',
                color: '#ffffff',
                width: '55%',
                maxWidth: '55%',
                border: '2px solid black',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    maxWidth: '50%',
                    maxHeight: '12rem',
                    width: '25%',
                    height: 'auto',
                    display: 'block',
                    margin: '0.5rem auto',
                    objectFit: 'contain',
                  }}
                />
              )}
              <div style={{ flex: 1, textAlign: 'center' }}>
                <h1 style={{ color: '#ffffff' }}>{item.name}</h1>
                <h4 style={{ color: '#ffffff' }}>{item.description}</h4>
                <h4 style={{ color: '#ffffff' }}>Quantity: {item.quantity}</h4>
                <h4 style={{ color: '#ffffff' }}>{item.complete ? '✔️ This item is complete' : '❌ This item is missing pieces'}</h4>
                <h4 style={{ color: '#ffffff' }}>
                  Container:{' '}
                  {container ? (
                    <Link
                      href={`/Items/${user.uid}/${container.id}`}
                      style={{
                        color: '#ffd700',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      {container.name}
                    </Link>
                  ) : (
                    'Unknown'
                  )}
                </h4>
                <div style={{ textAlign: 'center', color: '#ffffff', marginBottom: '0.5rem' }}>
                  <h4 style={{ color: '#ffffff', marginBottom: '0.25rem' }}>Categories:</h4>
                  {itemCategories.length > 0 ? (
                    itemCategories.map((category) => (
                      <span key={category.id} style={{ color: '#ffffff', marginRight: '10px' }}>
                        {category.name}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#ffffff' }}>No categories assigned</span>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

SearchPage.propTypes = {
  params: PropTypes.shape({
    query: PropTypes.string.isRequired,
  }).isRequired,
};
