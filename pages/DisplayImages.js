import React from 'react';
import "./css/DisplayImages.css";
import Chip from '@material-ui/core/Chip';
import pick from 'lodash/pick';

const bg = (url) => {
  return {
    'backgroundImage': `url(${url})`,
    'backgroundSize': 'auto 900%',
    'backgroundRepeat': 'no-repeat',
    'backgroundPosition': 'left top',
    'width': '44vw'
  };
};

const DisplayImages = ({ props: { files, setOpen } }) => {

  const prod = files.filter((i) => !i.src.match(/dev/));
  const dev = files.filter((i) => i.src.match(/dev/));
  let bgImageStyle = { float: 'left', width: '900px' }; // width: '900px', bbbackgroundSize: 'cover', margin: '10px 10px' };
  return (
    <div className="scroller">
      <div className='containImg'>
        {prod.map((item, num) => {
          const devResult = dev[num];
          const tags = pick(item, ['device', 'size', 'layout', 'dev' ]);
          const devStyle = { ...bgImageStyle };
          return <div key={`dd-${num}`}>
            <div key={`ddd-${num}`} style={{ overflow: 'auto', height: '100vh', float: 'clear' }}>
              <div key={num} className='imgItems' style={{...bgImageStyle}}>
                  <Chip style={{ float:'left' }} label="prod" />
                  {Object.keys(tags).sort().map((t) => <Chip style={{ float:'left' }} label={tags[t]} />)}
                  <br />
                  {item.layoutUrl && <a href={item.layoutUrl || "#"}>prod<br /></a>}
                  <img className="img" alt="" src={item.src} onClick={() => setOpen([item])} />< br />
              </div>
              {devResult &&
                <div key={`d-${num}`} className='imgItems' title={devResult.src} style={{...devStyle}}>
                  <Chip style={{ float:'left' }} label="dev" />
                  {Object.keys(tags).sort().map((t) => <Chip style={{ float:'left' }} label={tags[t]} />)}
                  <br />
                  {devResult.layoutUrl && <a href={devResult.layoutUrl || "#"}>dev<br /></a>}
                  <img className="img" alt="" src={devResult.src} onClick={() => setOpen([devResult])} /><br />
              </div>}
              {!devResult && <div className='imgItems' style={{...devStyle}} />}
            </div>
            <hr />
          </div>;
        })}
      </div>
    </div>);
}

export default DisplayImages;
