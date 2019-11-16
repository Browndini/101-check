import React from 'react';

const DisplayImages = (data) => {
  let { site, files, toggleModal } = data.props;

  return (
    <div className='contain-img'>
      {files.map((item, num) => {
        let bgImageStyle = { backgroundImage: `url(${item.src})` };
        return <div key={num} className='img-items' style={bgImageStyle} onClick={() => toggleModal(num, site)} ></div>;
      })}
    </div>
  );
}

export default DisplayImages;
