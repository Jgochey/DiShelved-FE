'use client';

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getContainerById } from '@/api/ContainerData';
import NewContainerForm from '@/components/forms/NewContainerForm';

export default function EditContainerPage({ params }) {
  const { containerId } = params;
  const [Container, setContainer] = useState(null);

  useEffect(() => {
    getContainerById(containerId).then(setContainer);
  }, [containerId]);

  if (!Container) return <div>Loading...</div>;

  return <NewContainerForm Container={Container} />;
}

EditContainerPage.propTypes = {
  params: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    containerId: PropTypes.string.isRequired,
  }).isRequired,
};
