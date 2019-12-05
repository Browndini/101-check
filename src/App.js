import React from 'react';
import ImgModal from './components/ImgModal';
import DisplaySection from './components/DisplaySection';
import './App.css';
import './imgs.css';
const base = {
  imgs: [],
  generating: '',
  doneGenerating: false,
};
const siteFiles = {
  s101: base,
  f101: base,
  l101: base,
  h101: base,
  tb:   base,
  de:   base,
  ip:   base,
  a101: base,
  p101: base,
  v101: base,
};
const sites = Object.keys(siteFiles);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      siteFiles,
    };
  }

  toggleModal = (item = false) => {
    this.setState(state => ({ open: item }));
  }

  render() {
    const { siteFiles, open } = this.state;
    let toggleModal = this.toggleModal;
    console.log('rendered');
    return (
      <div className="App App-header">
        {sites.map(site => <DisplaySection key={site} props={{siteFiles, site, toggleModal}} />)}

        <ImgModal props={{ toggleModal, open }} />
      </div>
    );
  }
}

export default App;
