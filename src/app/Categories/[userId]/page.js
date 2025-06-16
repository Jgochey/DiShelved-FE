'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/utils/context/authContext';
import { Button, Card } from 'react-bootstrap';
import Link from 'next/link';
// import { useParams, useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { deleteCategory, getCatergoriesByUserUid } from '../../../api/CategoryData';

function CategoriesPage() {
  const { user } = useAuth();
  // const params = useParams(); // <-- Get params from the URL
  // const router = useRouter(); // <-- For navigation
  // const { containerId } = params; // <-- Destructure params
  const [Categories, setCategories] = useState([]);

  const setUserCategories = () => {
    if (user && user.uid) {
      getCatergoriesByUserUid(user.uid).then((data) => {
        if (!data || Object.keys(data).length === 0) {
          setCategories([]);
          return;
        }
        // Always set as array
        setCategories(Array.isArray(data) ? data : Object.values(data));
      });
    }
  };

  useEffect(() => {
    setUserCategories();
  }, [user]);

  const deleteSavedCategory = (Category) => {
    if (window.confirm(`Delete ${Category.name}?`)) {
      deleteCategory(Category.id)
        .then(() => setUserCategories())
        .catch((error) => {
          alert(error.message || 'Failed to delete category');
        });
    }
  };

  if (Categories.length === 0) {
    return (
      <>
        <div>No categories found. Please add a new category.</div>
        <div className="text-center d-flex flex-column justify-content-center align-content-center newForecastOptions">
          <Link href={`/Categories/${user.uid}/new`} passHref>
            <Button variant="danger" type="button" size="lg" className="copy-btn" style={{ background: '#ffffff', borderColor: '#ffffff', color: '#1a1a1a' }}>
              Add New Category
            </Button>
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Card className="text-center justify-content-center align-items-center" style={{ background: '#305bab', marginBottom: '1rem', maxWidth: '50%', border: '2px solid black', justifyContent: 'center', alignItems: 'center', margin: '0 auto', marginTop: '1rem' }}>
        <h1 className="text-center" style={{ color: '#ffffff', marginTop: '1rem' }}>
          Create/Delete Categories for your Items.
        </h1>
        <h4 className="text-center" style={{ color: '#ffffff', marginBottom: '1rem' }}>
          You can enter a Category into the search bar to find all Items in that Category.
        </h4>
      </Card>

      <div className="text-center d-flex flex-column justify-content-center align-content-center newForecastOptions">
        <Link href={`/Categories/${user.uid}/new`} passHref>
          <Button variant="danger" type="button" size="lg" className="copy-btn" style={{ background: '#ffffff', borderColor: '#ffffff', color: '#1a1a1a', marginTop: '1rem' }}>
            Add New Category
          </Button>
        </Link>
      </div>

      {/* This should only be displayed if the user has saved Categories. If not, only show the "Add New Category" button. */}
      {Categories.length > 0 && (
        <div className="savedLocationsContainer">
          {Object.values(Categories).map((Category) => (
            <Card className="savedlocationcard" key={Category.id} style={{ background: '#305bab' }}>
              <h1 style={{ color: '#ffffff' }}>{Category.name}</h1>
              <h4 style={{ color: '#ffffff' }}> {Category.description} </h4>

              <Link href={`/Categories/${user.uid}/edit/${Category.id}`} passHref>
                <Button
                  variant="info"
                  style={{
                    background: '#ffffff',
                    borderColor: '#ffffff',
                    color: '#1a1a1a',
                    width: '12rem',
                    margin: '4px',
                  }}
                >
                  Edit
                </Button>
              </Link>

              <Button variant="danger" style={{ width: '12rem', margin: '4px' }} onClick={() => deleteSavedCategory(Category)}>
                Delete
              </Button>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

CategoriesPage.propTypes = {
  params: PropTypes.shape({
    userId: PropTypes.string.isRequired,
  }).isRequired,
};

export default CategoriesPage;
