import React from 'react';
import ImgModal from './components/ImgModal';
import DisplayImages from './components/DisplayImages';
import GenButton from './components/GenButton';
import './App.css';
import './imgs.css';
const siteFiles = {
  's101': { imgs:[] },
  'f101': { imgs:[] },
  'l101': { imgs:[] },
  'h101': { imgs:[] },
  'tb':   { imgs:[] },
  'de':   { imgs:[] },
  'ip':   { imgs:[] },
  'p101': { imgs:[] },
  'v101': { imgs:[] },
  'a101': { imgs:[] },
};
const sites = Object.keys(siteFiles);

// TODO: display all images
// TODO: generate seperate site images
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: '',
      selectedIndex: 0,
      siteFiles,
      site: '',  
      generating: '',
      doneGenerating: false,
    };
    sites.forEach(s => {
      this.fetchImages(s);
    })
  }

  toggleModal = (selectedIndex, site) => {
    this.setState(state => ({ modalIsOpen: site, selectedIndex }));
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
    const { modalIsOpen, selectedIndex, siteFiles, generating, doneGenerating } = this.state;
    let toggleModal = this.toggleModal;
    let generateImages = this.generateImages;

    return (
      <div className="App App-header">
        {sites.map(site => {
          let files = siteFiles[site].imgs;
          return (
            <div className='section' key={site}>
              <h3>{site}</h3>
              <DisplayImages props={{files, site, toggleModal}} />
              <div className='lower-section'>
                <GenButton props={{ generating, site, doneGenerating, generateImages }} />
              </div>
              <ImgModal props={{ selectedIndex, modalIsOpen, toggleModal, files, site }} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default App;
