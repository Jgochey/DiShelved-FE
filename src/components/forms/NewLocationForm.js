'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { createLocation, updateLocation } from '../../api/LocationData';

const initialState = {
  Name: '',
  Description: '',
  // UserId will be set after user is available
};

function NewLocationForm({ obj = initialState }) {
  const { user } = useAuth();
  const [formInput, setFormInput] = useState({ ...obj, UserId: user ? user.uid : '' });
  const router = useRouter();

  const saveLocation = () => {
    // If the UserId is already there then there must be something to update, otherwise this is a new creation.
    const createOrUpdate = obj.UserId ? updateLocation : createLocation;
    const locationData = { ...formInput, uid: user.uid };

    createOrUpdate(user.uid, obj.UserId ? obj.UserId : locationData, locationData)
      .then((response) => {
        if (!obj.UserId) {
          // If there is no UserId, give it one.
          const { name } = response;
          const patchPayload = { UserId: name };
          updateLocation(user.id, name, patchPayload).then(() => {
            router.push(`/Locations/${user.id}`);
          });
        } else {
          router.push(`/Locations/${user.id}`);
        }
      })
      .catch((error) => {
        console.error('Error saving location:', error);
      });
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
    saveLocation();
  };

  return (
    <Form onSubmit={handleSubmit} className="text-black">
      <h2 className="text-white mt-5">{obj.UserId ? 'Update' : 'Create'} Location</h2>

      {/* NAME INPUT  */}
      <FloatingLabel controlId="floatingInput1" label="Location Name" className="mb-3">
        <Form.Control type="text" placeholder="Enter a Name" name="name" value={formInput.name} onChange={handleChange} required />
      </FloatingLabel>

      {/* DESCRIPTION INPUT  */}
      <FloatingLabel controlId="floatingInput2" label="Location Description" className="mb-3">
        <Form.Control type="text" placeholder="Enter a Description" name="description" value={formInput.description} onChange={handleChange} required />
      </FloatingLabel>

      {/* SUBMIT BUTTON  */}
      <Button type="submit" style={{ background: '#bc6c25', borderColor: '#bc6c25' }}>
        {obj.UserId ? 'Update' : 'Save'} Location
      </Button>
    </Form>
  );
}

NewLocationForm.propTypes = {
  obj: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.number,
    UserId: PropTypes.string,
  }),
};

export default NewLocationForm;
