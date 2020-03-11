import React from 'react';
import "./css/DisplayImages.css";
import Chip from '@material-ui/core/Chip';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

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
const chipStyles = { float:'left', margin: '5px' };

const bounce = (genning) => genning && <span>&nbsp;&nbsp;<span className="c c-1">.</span><span className="c c-2">.</span><span className="c c-3">.</span></span>;

const DisplayImages = ({ files, site, setOpen, generating, doneGenerating, generateImages, setGenerating, setDoneGenerating, setCompleted }) => {
  const genning = ((generating === site) || (doneGenerating === site && generating === 'done'));
  // const disabled = genning ? { "pointerEvents": "none" } : {};
  const prod = files.filter((i) => !i.src.match(/dev/));
  const dev = files.filter((i) => i.src.match(/dev/));

  let bgImageStyle = { float: 'left', width: '44vw', padding: '10px' }; // width: '900px', bbbackgroundSize: 'cover', margin: '10px 10px' };
  const makeCell = ({ item, num , tags, slug, mode }) => {
    return (
      <div key={`${mode}-${num}`} className='imgItems' style={{...bgImageStyle}}>
          <Chip style={chipStyles} label={mode} avatar={<Avatar>{mode[0].toUpperCase()}</Avatar>} />
          <a href={item.layoutUrl} target='_blank'><Chip style={{...chipStyles, cursor: 'pointer'}} color="secondary" label={slug} avatar={<Avatar>LINK</Avatar>} /></a>
          {Object.keys(tags).sort().map((t, i) => <Chip style={chipStyles} key={`${mode}-chip-${num}-${i}`} label={tags[t]} />)}
          {item.genUrl && <Button variant="contained" style={{ float: 'right' }} onClick={() => generateImages(site, setGenerating, setDoneGenerating, null, null, null, setCompleted, item.genUrl)}>REDO {bounce(genning)}</Button>}
          <img className="img" alt="" src={item.src} onClick={() => setOpen([item])} />< br />
      </div>
    );
  };
  return (
    <div className="scroller">
      <div className='containImg'>
        {prod.map((item, num) => {
          const devItem = dev[num];
          const tags = pick(item, ['device', 'size', 'layout', 'dev' ]);
          const devStyle = { ...bgImageStyle };
          const chunks = item.layoutUrl.split(/\/+/);
          const [, , c] = chunks;
          const slug = c.split(/\?/)[0];
          return <div key={`dd-${num}`}>
            <div style={{ overflow: 'auto', height: '80vh', float: 'clear' }}>
              {item && makeCell({ item, num, tags, slug, mode: 'prod' })}
              {devItem && makeCell({ item: devItem, num, tags, slug, mode: 'dev' })}
              {!devItem && <div className='imgItems' style={{...devStyle}} />}
            </div>
            <hr />
          </div>;
        })}
      </div>
    </div>);
}

export default DisplayImages;
