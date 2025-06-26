'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { createContainer, updateContainer } from '../../api/ContainerData';
import { getUserByUid } from '../../api/UserData';

const initialState = {
  name: '',
  description: '',
  image: '',
  locationId: null,
};

function NewContainerForm({ locationId = null, Container = null }) {
  const { user } = useAuth();
  const [formInput, setFormInput] = useState(initialState);
  const router = useRouter();

  useEffect(() => {
    if (Container) {
      setFormInput({
        name: Container.name || '',
        description: Container.description || '',
        image: Container.image || '',
        locationId: Container.locationId ?? null,
        userId: Container.userId || null,
      });
    } else if (locationId) {
      // Set locationId for new containers
      setFormInput((prev) => ({
        ...prev,
        locationId,
      }));
    }
  }, [Container, locationId]);

  const saveContainer = async () => {
    try {
      const dbUser = await getUserByUid(user.uid);

      const ContainerData = {
        name: formInput.name,
        description: formInput.description,
        image: formInput.image,
        locationId: formInput.locationId,
        userId: dbUser.id,
      };

      if (Container && Container.id) {
        ContainerData.id = Container.id;
        await updateContainer(Container.id, ContainerData);
      } else {
        await createContainer(ContainerData);
      }

      // Use the resolved locationId for routing
      router.push(`/Containers/${user.uid}/${formInput.locationId}`);
    } catch (error) {
      console.error('Error saving Container:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveContainer();
  };

  return (
    <Form onSubmit={handleSubmit} className="text-black">
      <h2 className="text-white mt-5">{Container ? 'Update' : 'Create'} Container</h2>

      {/* NAME INPUT  */}
      <FloatingLabel controlId="floatingInput1" label="Container Name" className="mb-3">
        <Form.Control type="text" placeholder="Enter a Name" name="name" value={formInput.name} onChange={handleChange} required />
      </FloatingLabel>

      {/* DESCRIPTION INPUT  */}
      <FloatingLabel controlId="floatingInput2" label="Container Description" className="mb-3">
        <Form.Control type="text" placeholder="Enter a Description" name="description" value={formInput.description} onChange={handleChange} required />
      </FloatingLabel>

      {/* IMAGE INPUT  */}
      <FloatingLabel controlId="floatingInput3" label="Container Image URL" className="mb-3">
        <Form.Control type="text" placeholder="Enter an Image URL" name="image" value={formInput.image} onChange={handleChange} required />
      </FloatingLabel>

      {/* SUBMIT BUTTON  */}
      <Button type="submit" variant="success" className="mt-3">
        {Container ? 'Update' : 'Save'} Container
      </Button>
    </Form>
  );
}

NewContainerForm.propTypes = {
  locationId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  Container: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    image: PropTypes.string,
    locationId: PropTypes.number,
    userId: PropTypes.number,
  }),
};

export default NewContainerForm;
