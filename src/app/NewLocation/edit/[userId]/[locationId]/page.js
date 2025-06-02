'use client';

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getLocationById } from '@/api/LocationData';
import NewLocationForm from '@/components/forms/NewLocationForm';

export default function EditLocationPage({ params }) {
  const { locationId } = params;
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getLocationById(locationId).then(setLocation);
  }, [locationId]);

  if (!location) return <div>Loading...</div>;

  return <NewLocationForm location={location} />;
}

EditLocationPage.propTypes = {
  params: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    locationId: PropTypes.string.isRequired,
  }).isRequired,
};
