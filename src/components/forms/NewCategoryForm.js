'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useAuth } from '../../utils/context/authContext';
import { createCategory, updateCategory } from '../../api/CategoryData';
import { getUserByUid } from '../../api/UserData';

const initialState = {
  name: '',
  description: '',
  userId: null,
};

function NewCategoryForm({ userUid, Category = null }) {
  const { user } = useAuth();
  const [formInput, setFormInput] = useState(initialState);
  const router = useRouter();

  useEffect(() => {
    if (Category) {
      setFormInput({
        name: Category.name || '',
        description: Category.description || '',
        userId: Category.userId ?? null,
      });
    } else if (userUid) {
      setFormInput({
        ...initialState,
        userUid,
      });
    } else {
      setFormInput(initialState);
    }
  }, [Category, userUid]);

  // Wait for the user
  if (!user) {
    return <div>Loading...</div>;
  }

  const saveCategory = async () => {
    try {
      const dbUser = await getUserByUid(user.uid);

      const CategoryData = {
        name: formInput.name,
        description: formInput.description,
        userId: dbUser.id, // Use the database ID
      };

      if (Category && Category.id) {
        CategoryData.id = Category.id;
        await updateCategory(Category.id, CategoryData);
      } else {
        await createCategory(CategoryData);
      }

      // Use the resolved userId for routing
      router.push(`/Categories/${user.uid}`);
    } catch (error) {
      console.error('Error saving Category:', error);
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
    saveCategory();
  };

  return (
    <Form onSubmit={handleSubmit} className="text-black">
      <h2 className="text-white mt-5">{Category ? 'Update' : 'Create'} Category</h2>

      {/* NAME INPUT  */}
      <FloatingLabel controlId="floatingInput1" label="Category Name" className="mb-3">
        <Form.Control type="text" placeholder="Enter a Name" name="name" value={formInput.name} onChange={handleChange} required />
      </FloatingLabel>

      {/* DESCRIPTION INPUT  */}
      <FloatingLabel controlId="floatingInput2" label="Category Description" className="mb-3">
        <Form.Control type="text" placeholder="Enter a Description" name="description" value={formInput.description} onChange={handleChange} required />
      </FloatingLabel>

      {/* SUBMIT BUTTON  */}
      <Button type="submit" style={{ background: '#bc6c25', borderColor: '#bc6c25' }}>
        {Category ? 'Update' : 'Save'} Category
      </Button>
    </Form>
  );
}

NewCategoryForm.propTypes = {
  userUid: PropTypes.string.isRequired,
  Category: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    description: PropTypes.string,
    userId: PropTypes.number,
  }),
};

export default NewCategoryForm;
