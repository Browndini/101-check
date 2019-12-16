import React from 'react';
import DisplayImages from './DisplayImages';
import GenButton from './GenButton';

class DisplaySection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...props.props,
      generating: '',
      doneGenerating: false
    };
    // console.log('display section: ',this.state);

    this.fetchImages(props.props.site);
  }

  // its on google cloud
  fetchImages = async (site = 's101') => {
    const response = await fetch(`https://us-central1-novelty-1281.cloudfunctions.net/check-1/${site}`);
    const myJson = await response.json();
    let imgs = (myJson.files.length >= 0) ? myJson.files : [];

    this.setState(state => ({
      siteFiles: {
        ...state.siteFiles,
        [site]: {
          imgs
        }
      }
    }));
  }

  generateImages = async (site) => {
    this.setState(state => ({ generating: site }));
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

    await this.fetchImages(site);
    this.setState(state => ({ generating: 'done', doneGenerating: site }));
    setTimeout(() => {
      this.setState(state => ({ generating: '', doneGenerating: false }));
    }, 2000);
  }

  render() {
    let { siteFiles, site, toggleModal, doneGenerating, generating } = this.state;
    let generateImages = this.generateImages;
    let files = siteFiles[site].imgs;

    return (
      <div className='section' key={site}>
        <h3>{site}</h3>
        <DisplayImages props={{files, site, toggleModal}} />
        <div className='lower-section'>
          <GenButton props={{ generating, site, doneGenerating, generateImages }} />
        </div>
      </div>
    );
  }
}

// {
//   let files = siteFiles[site].imgs;
//   return (
//     <div className='section' key={site}>
//       <h3>{site}</h3>
//       <DisplayImages props={{files, site, toggleModal}} />
//       <div className='lower-section'>
//         <GenButton props={{ generating, site, doneGenerating, generateImages }} />
//       </div>
//     </div>
//   );
// }

export default DisplaySection;
