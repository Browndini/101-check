import React from 'react';
import './DisplayImages/imgs.css';

const DisplayImages = ({ props }) => {
  let { files, toggleModal, setOpen } = props;

  return (
    <div className='contain-img'>
      {files.map((item, num) => {
        let bgImageStyle = { backgroundImage: `url(${item.src})` };
        return <div key={num} className='img-items' style={bgImageStyle} onClick={() => setOpen([item])} ></div>;
      })}
    </div>
  );
}

export default DisplayImages;
