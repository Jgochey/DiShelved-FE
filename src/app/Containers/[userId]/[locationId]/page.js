'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/utils/context/authContext';
import { Button, Card } from 'react-bootstrap';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { deleteContainer, getContainersByLocationId } from '@/api/ContainerData';

function ContainersPage() {
  const { user } = useAuth();
  const params = useParams(); // <-- Get params from the URL
  const router = useRouter(); // <-- For navigation
  const { locationId } = params; // <-- Destructure params
  const [Containers, setContainers] = useState([]);

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

  useEffect(() => {
    setUserContainers();
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
      <div className="text-center d-flex flex-column justify-content-center align-content-center newForecastOptions">
        <Link href={`/NewContainer/${locationId}/new`} passHref>
          <Button variant="danger" type="button" size="lg" className="copy-btn" style={{ background: '#ffffff', borderColor: '#ffffff', color: '#1a1a1a' }}>
            Add New Container
          </Button>
        </Link>
      </div>

      {/* This should only be displayed if the user has saved containers. If not, only show the "Add New Container" button. */}
      {Containers.length > 0 && (
        <div className="savedContainersContainer">
          {Object.values(Containers).map((Container) => (
            <Card className="savedContainercard" key={Container.id} style={{ background: '#305bab' }}>
              <h1 style={{ color: '#ffffff' }}>{Container.name}</h1>
              <h4 style={{ color: '#ffffff' }}> {Container.description} </h4>
              <div className="d-flex justify-content-between">
                {' '}
                <img src={Container.image} alt={Container.name} style={{ width: '100px', height: '100px' }} />{' '}
              </div>

              <Link href={`/NewContainer/${locationId}/edit/${user.uid}/${Container.id}`} passHref>
                <Button variant="info" style={{ background: '#ffffff', borderColor: '#ffffff', color: '#1a1a1a', width: '100%' }}>
                  {' '}
                  Edit{' '}
                </Button>
              </Link>

              <Button variant="danger" onClick={() => deleteSavedContainer(Container)}>
                {' '}
                Delete{' '}
              </Button>

              {/* Note the link here for later */}
              <Link href={`/Items/${user.uid}/${Container.id}`} passHref>
                <Button variant="success"> View/Add Items </Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

export default ContainersPage;
