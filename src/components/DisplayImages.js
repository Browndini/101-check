import React from 'react';

const DisplayImages = ({ props }) => {
  let { files, toggleModal } = props;

  return (
    <div className='contain-img'>
      {files.map((item, num) => {
        let bgImageStyle = { backgroundImage: `url(${item.src})` };
        return <div key={num} className='img-items' style={bgImageStyle} onClick={() => toggleModal([item])} ></div>;
      })}
    </div>
  );
}

export default DisplayImages;
