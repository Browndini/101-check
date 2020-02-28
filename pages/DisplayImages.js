import React from 'react';
import "./css/DisplayImages.css";

const DisplayImages = ({ props: { files, setOpen } }) => {

  const prod = files.filter((i) => !i.src.match(/dev/));
  const dev = files.filter((i) => i.src.match(/dev/));
  let bgImageStyle = { float: 'left', width: '500px', height: '500px', backgroundSize: 'cover', margin: '10px 10px' };

  return (
    <div className="scroller">
      <h3>Prod</h3>
      <div className='containImg'>
        {prod.map((item, num) => {
          return <div>
            <h3>{item.src}</h3>
            <div key={num} className='imgItems' title={item.src} style={{ backgroundImage: `url(${item.src})`, ...bgImageStyle }} onClick={() => setOpen([item])} ></div>
            {dev[num] && <div key={num} className='imgItems' title={dev[num].src} style={{ backgroundImage: `url(${dev[num].src})`, ...bgImageStyle }} onClick={() => setOpen([item])} ></div>}
          </div>;
        })}
      </div>
    </div>);
}

export default DisplayImages;
