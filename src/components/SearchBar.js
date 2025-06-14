import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [formInput, setFormInput] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setFormInput(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (formInput !== '') {
      router.push(`/Search/${formInput}`);
    }
  };

  return (
    <Form className="d-flex text search-bar" onSubmit={handleSearch}>
      <Form.Control type="search" placeholder="Search Items" className="me-2" style={{ border: 'none', width: '25rem' }} aria-label="Search" name="search" onChange={handleChange} />
    </Form>
  );
}
