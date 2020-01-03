import React,  { useState, useEffect } from 'react';
import DisplayImages from './DisplayImages';
import GenButton from './GenButton';
import ImgModal from './ImgModal';

  const generateImages = async (site, setGenerating, setDoneGenerating, base, setBase) => {
    setGenerating(site);
    // this.setState(state => ({ generating: site }));
    let ss = [];
    ['large', 'small', 'medium'].forEach(size => {
      ['newnext', 'newnext2'].forEach(layout => {
        ['mobile', 'desktop'].forEach(device => {
          if ( size === 'small' && device === 'mobile') {
            ss.push(fetch(`https://us-central1-novelty-1281.cloudfunctions.net/create-101-imgs/${site}/${device}/iphone/${layout}`))
          } else if (device !== 'mobile') {
            ss.push(fetch(`https://us-central1-novelty-1281.cloudfunctions.net/create-101-imgs/${site}/${device}/${size}/${layout}`));
          }
        });
      });
    });


    let final = false;
    await Promise.all(ss)
      .then(e=> e)
      .then(responses => Promise.all(responses.map(r => r.json())))
      .then(data => {
        let m = data.findIndex(s => s.done === false);
        if(m >= 0) {
          final = data[m];
        }
      }).catch(e => {
        console.log('woooo',e);
      })
      console.log('wo yeah ',final);

    await fetchImages(base, setBase, site);
    setDoneGenerating(site);
    setGenerating('done');
    // this.setState(state => ({ generating: 'done', doneGenerating: site }));
    setTimeout(() => {
      setDoneGenerating(false);
      setGenerating('');
      // this.setState(state => ({ generating: '', doneGenerating: false }));
    }, 2000);
  
  }


const DisplaySection = ({ props }) => {
  const { site } = props;
  const [ generating, setGenerating ] = useState('');
  const [ doneGenerating, setDoneGenerating ] = useState(false);
  const [ value, setValue ] = useState(0);
  const [ open, setOpen ] = useState(false);
  const [ base, setBase ] = useState({
    imgs: [],
    generating: '',
    doneGenerating: false,
  });

  // if (base.imgs.length <= 0) {
  //   fetchImages(base, setBase, site);
  // }

  useEffect( () => {
    (async () => {
      await fetchImages(base, setBase, site);
    })();
  }, []);

  return (
    <div className='section' key={site}>
      <h2>{site}</h2>
      <DisplayImages props={{files: base.imgs, setOpen}} />
      <div className='lower-section'>
        <GenButton props={{ generating, site, doneGenerating, generateImages, setGenerating, setDoneGenerating, base, setBase }} />
      </div>
      <ImgModal props={{ setOpen, open }} />
    </div>
  )
};

const fetchImages = async (base, setBase, site) => {
  const response = await fetch(`https://us-central1-novelty-1281.cloudfunctions.net/check-1/${site}`);
  const myJson = await response.json();
  let imgs = (myJson.files.length >= 0) ? myJson.files : [];

  let updateFiles = {
    ...base,
    imgs
  };

  setBase(updateFiles);
};

export default DisplaySection;
