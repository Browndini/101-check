import React from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';

const ImgModal = (data) => {
  let { selectedIndex, modalIsOpen, toggleModal, files, site } = data.props;

  return (
    <ModalGateway>
      {modalIsOpen === site ? (
        <Modal onClose={toggleModal}>
          <Carousel views={files} currentIndex={selectedIndex} />
        </Modal>
      ) : null}
    </ModalGateway>
  );

}

export default ImgModal;
