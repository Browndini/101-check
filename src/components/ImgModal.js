import React from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';

function ImgModal(props) {
  let {selectedIndex, modalIsOpen, toggleModal, files } = props.props;

  return (
    <ModalGateway>
      {modalIsOpen ? (
        <Modal onClose={toggleModal}>
          <Carousel views={files} currentIndex={selectedIndex} />
        </Modal>
      ) : null}
    </ModalGateway>
  );

}

export default ImgModal;
