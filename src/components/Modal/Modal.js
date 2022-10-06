import { useEffect } from "react";
import Modal from "react-bootstrap/Modal";

function ErrorModal({ modal, setModal, msg }) {
  function handleClose() {
    setModal(false);
  }

  useEffect(() => {}, []);

  return (
    <>
      <Modal show={modal} onHide={handleClose}>
        <Modal.Body>{msg}</Modal.Body>
      </Modal>
    </>
  );
}

export default ErrorModal;
