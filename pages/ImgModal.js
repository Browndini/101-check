import React from 'react';
import Modal from '@material-ui/core/Modal';

const ImgModal = ({ setOpen, open }) => {
  return (
    <Modal
      aria-labelledby="spring-modal-title"
      aria-describedby="spring-modal-description"
      open={!!open}
      onClose={() => setOpen(false)}
      style={{ 'display': 'flex', 'alignItems': 'center', 'justifyContent': 'center'}}
    >
      <div className={'unfocus'}>
      <img className={'modalImage'} alt={'site layout'} src={open && open[0].src} />
      </div>
    </Modal>
  );
}

export default ImgModal;
