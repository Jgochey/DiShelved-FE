'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/utils/context/authContext';
import { Button, Card } from 'react-bootstrap';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { deleteLocation, getLocationsByUserUid } from '../../../api/LocationData';

function LocationsPage() {
  const { user } = useAuth();
  const [locations, setLocations] = useState([]);
  const params = useParams();
  const router = useRouter();

  const setUserLocations = () => {
    if (user && user.uid) {
      getLocationsByUserUid(user.uid)
        // If the data is empty, redirect to the New Location form
        .then((data) => {
          if (!data || Object.keys(data).length === 0) {
            // Redirect to the New Location form if the user does not have any saved locations
            window.location.replace('/NewLocation/new');
            return;
          }
          setLocations(data);
        });
    }
  };

  useEffect(() => {
    if (user.uid !== params.userId) {
      // Redirect to the main page if user ID does not match
      router.replace('/');
      return;
    }
    setUserLocations();
  }, [user]);

  const deleteSavedLocation = (location) => {
    if (window.confirm(`Delete ${location.name}?`)) {
      deleteLocation(location.id)
        .then(() => setUserLocations())
        .catch((error) => {
          alert(error.message || 'Failed to delete location');
        });
    }
  };

  return (
    <>
      <div className="text-center d-flex flex-column justify-content-center align-content-center newForecastOptions">
        <Link href="/NewLocation/new" passHref>
          <Button variant="danger" type="button" size="lg" className="copy-btn" style={{ background: '#ffffff', borderColor: '#ffffff', color: '#1a1a1a', marginTop: '1rem' }}>
            Add New Location
          </Button>
        </Link>
      </div>

      <div className="savedLocationsContainer">
        {Object.values(locations).map((location) => (
          <Card className="savedlocationcard" key={location.id} style={{ background: '#305bab' }}>
            <h1 style={{ color: '#ffffff' }}>{location.name}</h1>
            <h5 style={{ color: '#ffffff' }}> {location.description} </h5>

            <Link href={`/Containers/${user.uid}/${location.id}`} passHref>
              <Button variant="success" style={{ width: '12rem', margin: '4px' }}>
                {' '}
                View/Add Containers{' '}
              </Button>
            </Link>

            <Link href={`/NewLocation/edit/${user.uid}/${location.id}`} passHref>
              <Button variant="info" style={{ background: '#ffffff', borderColor: '#ffffff', color: '#1a1a1a', width: '12rem', margin: '4px' }}>
                {' '}
                Edit{' '}
              </Button>
            </Link>

            <Button variant="danger" style={{ width: '12rem', margin: '4px' }} onClick={() => deleteSavedLocation(location)}>
              {' '}
              Delete{' '}
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
}

export default LocationsPage;
