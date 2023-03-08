import { useContext } from 'react';
import Modal from 'react-bootstrap/Modal';

import { ModalContext } from '../../context/ModalContext';

export function CustomModal({ children, backdrop, centered }) {
  const { handleClose, handleShow, show } = useContext(ModalContext);

  return (
    <>
      <Modal
        centered={centered}
        backdrop={backdrop}
        show={show}
        onHide={handleClose}
      >
        {children}
      </Modal>
    </>
  );
}
