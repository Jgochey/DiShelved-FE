import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';

function ModalForCategory({ categories, selectedCategoryIds = [], onCategoryAdd, onCategoryRemove }) {
  const [list, setList] = useState(false);

  const handleClose = () => setList(false);
  const handleList = () => setList(true);

  const submitClick = (categoryId) => {
    if (selectedCategoryIds.includes(categoryId)) {
      onCategoryRemove(categoryId);
    } else {
      onCategoryAdd(categoryId);
    }
    handleClose();
  };

  return (
    <>
      <Button variant="success" onClick={handleList}>
        Categories
      </Button>
      <Modal show={list} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="genreTitle" style={{ color: 'black' }}>
            Select a Category
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {categories.map((category) => (
            <Button key={category.id} className="genreModalList" variant={selectedCategoryIds.includes(category.id) ? 'danger' : 'success'} onClick={() => submitClick(category.id)}>
              {selectedCategoryIds.includes(category.id) ? `Remove ${category.name}` : category.name}
            </Button>
          ))}
        </Modal.Body>
      </Modal>
    </>
  );
}

ModalForCategory.propTypes = {
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      description: PropTypes.string,
      userId: PropTypes.string,
    }),
  ),
  selectedCategoryIds: PropTypes.arrayOf(PropTypes.number),
  onCategoryAdd: PropTypes.func.isRequired,
  onCategoryRemove: PropTypes.func.isRequired,
};

export default ModalForCategory;
