import React,  { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import DisplayImages from './DisplayImages';
import GenButton from './GenButton';
import Router from 'next/router';
import ImgModal from './ImgModal';

import { config } from '../config';

const { siteTests } = require('../api/create/img-config');

// temporary disabled cloud functions because they take to long
// for cloud functions
  const generateImages = async (site, setGenerating, setDoneGenerating, base, setBase, dev) => {
    const siteKeys = Object.keys(siteTests[site]);
    setGenerating(site);
    // this.setState(state => ({ generating: site }));
    let ss = [];
    ['large', 'small', 'medium'].forEach(size => {
      [siteKeys[0]].forEach(layout => {
        ['mobile', 'desktop'].forEach(device => {
          if ( size === 'small' && device === 'mobile') {
            ss.push(fetch(`${config.generateImages}/${site}/${device}/iphone/${layout}${dev ? '/dev' : ''}`));
          } else if (device !== 'mobile') {
            ss.push(fetch(`${config.generateImages}/${site}/${device}/${size}/${layout}${dev ? '/dev' : ''}`));
          }
        });
      });
    });

    console.log({ ss });

    let final = false;
    await Promise.all(ss)
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

      setDoneGenerating(site);
      setGenerating('done');

      setTimeout(() => {
        setDoneGenerating(false);
        setGenerating('');
        Router.push(`/check/${site}`);
      }, 2000);

  }


const DisplaySection = ({ props }) => {
  const { site, imgs } = props;
  const [ generating, setGenerating ] = useState('');
  const [ doneGenerating, setDoneGenerating ] = useState(false);
  const [ open, setOpen ] = useState(false);
  const [ base, setBase ] = useState({
    imgs,
    generating: '',
    doneGenerating: false,
  });

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

export default DisplaySection;
