import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const MyModal = ({ showModal, closeModal, handleSaveChanges }) => {
  return (
    <Modal show={showModal} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>ALERT</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you Sure</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Close
        </Button>
        <Button variant="primary" style={{backgroundColor:'#e94057',border:'none'}} onClick={handleSaveChanges}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyModal;
