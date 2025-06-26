'use client';

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getCategoryById } from '@/api/CategoryData';
import NewCategoryForm from '@/components/forms/NewCategoryForm';

export default function EditCategoryPage({ params }) {
  const { categoryId } = params;
  const [Category, setCategory] = useState(null);

  useEffect(() => {
    getCategoryById(categoryId).then(setCategory);
  }, [categoryId]);

  if (!Category) return <div>Loading...</div>;

  return <NewCategoryForm Category={Category} />;
}

EditCategoryPage.propTypes = {
  params: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    categoryId: PropTypes.string.isRequired,
  }).isRequired,
};
