import React from 'react';
import ImgModal from './components/ImgModal';
import './App.css';
import './imgs.css';
const sites = ['s101', 'f101', 'l101', 'h101', 'p101', 'v101', 'a101', 'tb'];

// TODO: display all images
// TODO: generate seperate site images
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      selectedIndex: 0,
      files: [],
      site: '',
      generating: false,
      doneGenerating: false,
    };
    this.fetchImages();
  }

  // generateImages = () => {
  //   'http://localhost:3001/create/img/s101'
  //   this.setState(state => ({ generating: !state.generating }));
  // }

  toggleModal = (selectedIndex) => {
    this.setState(state => ({ modalIsOpen: !state.modalIsOpen, selectedIndex }));
  }

  fetchImages = async (site = 's101') => {
    const response = await fetch(`http://localhost:3001/img/${site}`);
    const myJson = await response.json();
  
    myJson.files = myJson.files.map(img => ({src: `/img/${myJson.site}/${img}`}));
    this.setState(myJson);
  }

  generateImages = async () => {
    this.setState(state => ({ generating: !state.generating }));
    const response = await fetch('http://localhost:3001/create/img/s101');
    const myJson = await response.json();
    if(!myJson.done) return true;
    await this.fetchImages();
    this.setState(state => ({ generating: !state.generating, doneGenerating: myJson.done }));
    setTimeout(() => {
      this.setState(state => ({ doneGenerating: false }));
    }, 2000);
  }

  render() {
    const { modalIsOpen, selectedIndex, files, generating, doneGenerating } = this.state;
    let toggleModal = this.toggleModal;

    return (
      <div className="App App-header">
        {sites.map(site =>
          (<div className='cool'>
            <h3>{site}</h3>
            <div className='contain-img'>
              {files.map((item, num) => {
                let bgImageStyle = { backgroundImage: `url(${item.src})` };
                return <div key={num} className='img-items' style={bgImageStyle} onClick={() => toggleModal(num)} ></div>;
              })}
            </div>
            <div className='lower-section'>
              <div className='button' onClick={() => this.generateImages()}>
                {generating ? (<span>Generating<span class="c c-1">.</span><span class="c c-2">.</span><span class="c c-3">.</span></span>) : (doneGenerating ? 'Done!' : 'Generate')}
              </div>
            </div>
          </div>)
        )}
      {/* <div className='cool'>
        <h3>{site}</h3>
        <div className='contain-img'>
          {files.map((item, num) => {
            let bgImageStyle = { backgroundImage: `url(${item.src})` };
            return <div key={num} className='img-items' style={bgImageStyle} onClick={() => toggleModal(num)} ></div>;
          })}
        </div>
        <div className='lower-section'>
          <div className='button' onClick={() => this.generateImages()}>
            {generating ? (<span>Generating<span class="c c-1">.</span><span class="c c-2">.</span><span class="c c-3">.</span></span>) : (doneGenerating ? 'Done!' : 'Generate')}
          </div>
        </div>
      </div> */}

        <ImgModal props={{selectedIndex, modalIsOpen, toggleModal, files}} />
      </div>
    );
  }
}

export default App;
