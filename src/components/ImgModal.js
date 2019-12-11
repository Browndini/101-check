import React from 'react';
import Modal from '@material-ui/core/Modal';



const ImgModal = ({ props: { toggleModal, open } }) => {

  return (
    <Modal
      aria-labelledby="spring-modal-title"
      aria-describedby="spring-modal-description"
      open={!!open}
      onClose={() => toggleModal()}
      style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}
    >
      <div className={'unfocus'}>
      <img className={'modalImage'} src={open && open[0].src} />
      </div>
    </Modal>
  );

}

export default ImgModal;
