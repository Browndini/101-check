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
    console.log('display section: ',this.state);

    this.fetchImages(props.props.site);
  }

  fetchImages = async (site = 's101') => {
    const response = await fetch(`http://localhost:3001/img/${site}`);
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
    const response = await fetch(`http://localhost:3001/create/img/${site}`);
    const myJson = await response.json();
    if(!myJson.done) return true;
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
