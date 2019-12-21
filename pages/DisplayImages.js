import React from 'react';

const DisplayImages = ({ props: { files, setOpen } }) => {
  return (
    <div className='containImg'>
      {files.map((item, num) => {
        let bgImageStyle = { backgroundImage: `url(${item.src})`, width: '150px', height: '150px', backgroundSize: 'cover', margin: '10px 10px' };
        return <div key={num} className='imgItems' style={bgImageStyle} onClick={() => setOpen([item])} ></div>;
      })}
    </div>
  );
}

export default DisplayImages;
