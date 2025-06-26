'use client';

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/utils/context/authContext';
import { Button, Card } from 'react-bootstrap';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { deleteContainer, getContainersByLocationId } from '@/api/ContainerData';
import { getLocationById } from '../../../../api/LocationData';

function ContainersPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const { locationId } = params;
  const [Containers, setContainers] = useState([]);
  const [locationName, setLocationName] = useState('');
  const [locationDescription, setLocationDescription] = useState('');

  const setUserContainers = () => {
    if (user && user.uid && locationId) {
      getContainersByLocationId(locationId).then((data) => {
        if (!data || Object.keys(data).length === 0) {
          router.replace(`/NewContainer/${locationId}/new`);
          return;
        }
        setContainers(data);
      });
    }
  };

  const setLocationNameFromId = () => {
    if (locationId) {
      getLocationById(locationId).then((location) => {
        setLocationName(location?.name || '');
        setLocationDescription(location?.description || '');
      });
    }
  };

  useEffect(() => {
    if (user.uid !== params.userId) {
      // Redirect to the main page if user ID does not match
      router.replace('/');
      return;
    }
    setUserContainers();
    setLocationNameFromId();
  }, [user, locationId]);

  const deleteSavedContainer = (Container) => {
    if (window.confirm(`Delete ${Container.name}?`)) {
      deleteContainer(Container.id)
        .then(() => setUserContainers())
        .catch((error) => {
          alert(error.message || 'Failed to delete container');
        });
    }
  };

  return (
    <>
      <Card className="text-center justify-content-center align-items-center" style={{ background: '#305bab', marginBottom: '1rem', maxWidth: '50%', border: '2px solid black', justifyContent: 'center', alignItems: 'center', margin: '0 auto', marginTop: '1rem' }}>
        <h1 className="text-center" style={{ color: '#ffffff', marginTop: '1rem' }}>
          {locationName ? `${locationName}` : 'Loading location...'}
        </h1>
        <h4 className="text-center" style={{ color: '#ffffff', marginBottom: '1rem' }}>
          {locationDescription ? `${locationDescription}` : 'Loading description...'}
        </h4>
      </Card>
      <div className="text-center d-flex flex-column justify-content-center align-content-center newForecastOptions">
        <Link href={`/NewContainer/${locationId}/new`} passHref>
          <Button
            variant="danger"
            type="button"
            size="lg"
            className="copy-btn"
            style={{
              background: '#ffffff',
              borderColor: '#ffffff',
              color: '#1a1a1a',
              marginTop: '1rem',
            }}
          >
            Add New Container
          </Button>
        </Link>
      </div>

      <div className="savedLocationsContainer">
        {Object.values(Containers).map((container) => (
          <Card className="savedlocationcard" key={container.id} style={{ background: '#305bab' }}>
            <h1 style={{ color: '#ffffff' }}>{container.name}</h1>
            <h5 style={{ color: '#ffffff' }}>{container.description}</h5>
            <img
              src={container.image}
              alt={container.name}
              style={{
                maxWidth: '90%',
                maxHeight: '175px',
                width: 'auto',
                height: 'auto',
                display: 'block',
                margin: '0.5rem auto',
                objectFit: 'contain',
              }}
            />

            <Link href={`/Items/${user.uid}/${container.id}`} passHref>
              <Button variant="success" style={{ width: '12rem', margin: '4px' }}>
                View/Add Items
              </Button>
            </Link>

            <Link href={`/NewContainer/${locationId}/edit/${user.uid}/${container.id}`} passHref>
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

            <Button variant="danger" style={{ width: '12rem', margin: '4px' }} onClick={() => deleteSavedContainer(container)}>
              Delete
            </Button>
          </Card>
        ))}
      </div>
    </>
  );
}

export default ContainersPage;
