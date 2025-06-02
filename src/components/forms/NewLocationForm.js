'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { createLocation, updateLocation } from '../../api/LocationData';
import { getUserByUid } from '../../api/UserData';

const initialState = {
  Name: '',
  Description: '',
};

function NewLocationForm({ location = null }) {
  const { user } = useAuth();
  const [formInput, setFormInput] = useState(initialState);
  const router = useRouter();

  useEffect(() => {
    if (location) {
      setFormInput({
        Name: location.name || '',
        Description: location.description || '',
      });
    }
  }, [location]);

  const saveLocation = async () => {
    try {
      const dbUser = await getUserByUid(user.uid);

      const locationData = {
        Name: formInput.Name,
        Description: formInput.Description,
        UserId: dbUser.id, // Use the database ID
      };

      if (location && location.id) {
        // Only add Id when updating
        locationData.Id = location.id;
        await updateLocation(location.id, locationData);
      } else {
        // Do not include Id for creation
        await createLocation(locationData);
      }
      router.push(`/Locations/${user.uid}`);
    } catch (error) {
      console.error('Error saving location:', error);
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
    saveLocation();
  };

  return (
    <Form onSubmit={handleSubmit} className="text-black">
      <h2 className="text-white mt-5">{location ? 'Update' : 'Create'} Location</h2>

      {/* NAME INPUT  */}
      <FloatingLabel controlId="floatingInput1" label="Location Name" className="mb-3">
        <Form.Control type="text" placeholder="Enter a Name" name="Name" value={formInput.Name} onChange={handleChange} required />
      </FloatingLabel>

      {/* DESCRIPTION INPUT  */}
      <FloatingLabel controlId="floatingInput2" label="Location Description" className="mb-3">
        <Form.Control type="text" placeholder="Enter a Description" name="Description" value={formInput.Description} onChange={handleChange} required />
      </FloatingLabel>

      {/* SUBMIT BUTTON  */}
      <Button type="submit" style={{ background: '#bc6c25', borderColor: '#bc6c25' }}>
        {location ? 'Update' : 'Save'} Location
      </Button>
    </Form>
  );
}

NewLocationForm.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    userId: PropTypes.number,
  }),
};

export default NewLocationForm;
