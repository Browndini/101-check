import React from 'react';

// import PropTypes from 'prop-types';
// import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';

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
// const [value, setValue] = React.useState(0);
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


  handleChange = (event, newValue) => {
    // setValue(newValue);
  };
  render() {
    const value = 0;
    const setValue =  ()  => {};
    const { siteFiles, open } = this.state;
    let toggleModal = this.toggleModal;
    console.log('rendered',open, !!open);


    return (
      <div className="App App-header">
      <AppBar position="static">
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={this.handleChange}
          aria-label="nav tabs example"
        >
          <LinkTab label="Page One" href="/drafts" {...a11yProps(0)} />
          <LinkTab label="Page Two" href="/trash" {...a11yProps(1)} />
          <LinkTab label="Page Three" href="/spam" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        {sites.map(site => <DisplaySection key={site} props={{siteFiles, site, toggleModal}} />)}

        <ImgModal props={{ toggleModal, open }} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Page Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Page Three
      </TabPanel>

      </div>
    );
  }
}

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={event => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

function a11yProps(index) {
  return {
    id: `nav-tab-${index}`,
    'aria-controls': `nav-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`nav-tabpanel-${index}`}
      aria-labelledby={`nav-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

export default App;
