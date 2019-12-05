import React from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';


const ImgModal = ({ props: { toggleModal, open } }) => {

  return (
    <ModalGateway>
      {open ? (
        <Modal onClose={() => {toggleModal(false)}}>
          <Carousel views={open} />
        </Modal>
      ) : null}
    </ModalGateway>
  );

}

export default ImgModal;
