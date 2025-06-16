'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { createItem, updateItem } from '../../api/ItemData';
import { getUserByUid } from '../../api/UserData';

const initialState = {
  name: '',
  description: '',
  quantity: 0,
  complete: true,
  image: '',
  containerId: null,
};

function NewItemForm({ containerId = null, Item = null }) {
  const { user } = useAuth();
  const [formInput, setFormInput] = useState(initialState);
  const router = useRouter();

  useEffect(() => {
    if (Item) {
      setFormInput({
        name: Item.name || '',
        description: Item.description || '',
        quantity: Item.quantity || 0,
        complete: !!Item.complete, // force boolean
        image: Item.image || '',
        containerId: Item.containerId ?? null,
        userId: Item.userId || null,
      });
    } else if (containerId) {
      setFormInput({
        ...initialState,
        containerId,
      });
    } else {
      setFormInput(initialState);
    }
  }, [Item, containerId]);

  const saveItem = async () => {
    try {
      const dbUser = await getUserByUid(user.uid);

      const ItemData = {
        name: formInput.name,
        description: formInput.description,
        quantity: formInput.quantity,
        complete: formInput.complete,
        image: formInput.image,
        containerId: formInput.containerId,
        userId: dbUser.id,
      };

      if (Item && Item.id) {
        ItemData.id = Item.id;
        await updateItem(Item.id, ItemData);
      } else {
        await createItem(ItemData);
      }

      // Use the resolved containerId for routing
      router.push(`/Items/${user.uid}/${formInput.containerId}`); // <-- use formInput.containerId
    } catch (error) {
      console.error('Error saving Item:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: name === 'complete' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveItem();
  };

  return (
    <Form onSubmit={handleSubmit} className="text-black">
      <h2 className="text-white mt-5">{Item ? 'Update' : 'Create'} Item</h2>

      {/* NAME INPUT  */}
      <FloatingLabel controlId="floatingInput1" label="Item Name" className="mb-3">
        <Form.Control type="text" placeholder="Enter a Name" name="name" value={formInput.name} onChange={handleChange} required />
      </FloatingLabel>

      {/* DESCRIPTION INPUT  */}
      <FloatingLabel controlId="floatingInput2" label="Item Description" className="mb-3">
        <Form.Control type="text" placeholder="Enter a Description" name="description" value={formInput.description} onChange={handleChange} required />
      </FloatingLabel>

      {/* QUANTITY INPUT  */}
      <FloatingLabel controlId="floatingInput4" label="Item Quantity" className="mb-3">
        <Form.Control type="number" placeholder="Enter a Quantity" name="quantity" value={formInput.quantity} onChange={handleChange} required />
      </FloatingLabel>

      {/* IS COMPLETE TOGGLE  */}
      <h4 style={{ color: '#ffffff' }}>Is this item complete? (Not missing any pieces.)</h4>
      <FloatingLabel controlId="floatingInput5" label="" className="mb-3">
        <Form.Check type="checkbox" id="completeSwitch" label={formInput.complete ? 'Complete' : 'Incomplete'} name="complete" checked={!!formInput.complete} onChange={handleChange} />
      </FloatingLabel>

      {/* IMAGE INPUT  */}
      <FloatingLabel controlId="floatingInput3" label="Item Image URL" className="mb-3">
        <Form.Control type="text" placeholder="Enter an Image URL" name="image" value={formInput.image} onChange={handleChange} required />
      </FloatingLabel>

      {/* SUBMIT BUTTON  */}
      <Button type="submit" variant="success" className="mt-3">
        {Item ? 'Update' : 'Save'} Item
      </Button>
    </Form>
  );
}

NewItemForm.propTypes = {
  containerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  Item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    quantity: PropTypes.number,
    complete: PropTypes.bool,
    image: PropTypes.string,
    containerId: PropTypes.number,
    userId: PropTypes.number,
  }),
};

export default NewItemForm;
