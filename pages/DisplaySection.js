import React,  { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import DisplayImages from './DisplayImages';
import GenButton from './GenButton';
import Router from 'next/router';
import ImgModal from './ImgModal';
import LinearProgress from '@material-ui/core/LinearProgress';
import mapLimit from 'async/mapLimit';

import { config } from '../config';

const { siteTests } = require('../api/create/img-config');

// temporary disabled cloud functions because they take to long
// for cloud functions
  const generateImages = async (site, setGenerating, setDoneGenerating, base, setBase, dev, setCompleted, url) => {
    let ss = [];

    if (url) { // just make one
      ss = [`${config.generateImages}${url}`];
    } else {
      const siteKeys = Object.keys(siteTests[site]);
      setGenerating(site);
      // ['large'].forEach(size => {
        // [siteKeys[0]].forEach(layout => {
      ['large', 'small', 'medium'].forEach(size => {
        siteKeys.forEach(layout => {
          ['mobile', 'desktop'].forEach(device => {
            if ( size === 'small' && device === 'mobile') {
              ss.push(`${config.generateImages}/${site}/${device}/iphone/${layout}${dev ? '/dev' : ''}`);
            } else if (device !== 'mobile') {
              ss.push(`${config.generateImages}/${site}/${device}/${size}/${layout}${dev ? '/dev' : ''}`);
            }
          });
        });
      });
    }

    setCompleted(1);

    // let final = false;
    const results = [];
    let done = 0;
    mapLimit(ss, 4, async (item) => {
      const res = await fetch(item);
      done++;
      console.log('fetching ...', item, (done / ss.length) * 100);
      setCompleted((done / ss.length) * 100);
      results.push(res);
    }, (err, res) => {
      Promise.all(results)
        .then(responses => {
          return Promise.all(responses.map(r => r.json()));
        })
        .then(data => {
          let m = data.findIndex(s => s.done === false);
          if (m >= 0) {
            // final = data[m];
          }
        }).catch(e => {
          console.error('woooo',e);
        });

        setDoneGenerating(site);
        setGenerating('done');

        setTimeout(() => {
          setDoneGenerating(false);
          setGenerating('');
          setCompleted(0);
          Router.push(`/check/${site}`);
        }, 2000);
    });
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
  const [completed, setCompleted] = useState(0);

  return (
    <div className='section' key={site}>
      <h2>{site}</h2>
      <div className='lower-section'>
        <GenButton props={{ generating, site, doneGenerating, generateImages, setGenerating, setDoneGenerating, base, setBase, setCompleted }} />
      </div>
      {completed === 0 && <DisplayImages props={{files: base.imgs, site, setOpen, doneGenerating, generating, setGenerating, setDoneGenerating, generateImages, setCompleted}} />}
      {completed !== 0 && <LinearProgress variant="determinate" value={completed} />}
      <ImgModal props={{ setOpen, open }} />
    </div>
  )
};

export default DisplaySection;
