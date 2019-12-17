import React, { useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import ImgModal from './components/ImgModal';
import DisplaySection from './components/DisplaySection';
import './Home.css';

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
const styles = {
  container: { "display": "flex", "flexGrow": "1", "width": "100vw", "height": "100vh" },
  tabs: { "borderRight": "solid black 1px" , "background": "#94A89A"}
};
const sites = Object.keys(siteFiles);
const addImgs = (setAllSiteFiles, imgs) => {
  console.log(imgs);
  setAllSiteFiles(imgs);
}

const Home = () => {
  const [ allSiteFiles, setAllSiteFiles ] = useState(siteFiles);
  const [ open, setOpen ] = useState(false);
  const [ value, setValue ] = useState(0);
  // const { siteFiles, open, value } = this.state;
  // const toggleModal = this.toggleModal;
  console.log('called render,,...', allSiteFiles);
  return (
    <div style={styles.container}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={(event, newValue) => {setValue(newValue)}}
        aria-label="Vertical tabs example"
        style={styles.tabs}
      >
        {sites.map((site, index) => <Tab key={site} label={`${site}`} id={`vertical-tab-${index}`} />)}
      </Tabs>

      {sites.map((site, index) => {
        return (
          <TabPanel key={site} value={value} index={index}>
            <DisplaySection key={site} props={{allSiteFiles, setAllSiteFiles, addImgs, site, setOpen}} />

            <ImgModal props={{ setOpen, open }} />
          </TabPanel>
        );
        
      })}
    </div>
  );
}
// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       open: false,
//       siteFiles,
//       value: 0
//     };
//   }

  // const toggleModal = (item = false) => {
  //   this.setState(state => ({ open: item }));
  // }

  // render() {
    // const [ allSiteFiles, setSiteFiles ] = useState(siteFiles);
    // const [ open, setOpen ] = useState(false);
    // const [ value, setValue ] = useState(0);
    // // const { siteFiles, open, value } = this.state;
    // // const toggleModal = this.toggleModal;

    // return (
    //   <div style={{"display":"flex", "flexGrow": "1", "width": "100vw", "height": "100vh"}}>
    //     <Tabs
    //       orientation="vertical"
    //       variant="scrollable"
    //       value={value}
    //       onChange={(event, newValue) => {this.setState(state => ({ value: newValue }))}}
    //       aria-label="Vertical tabs example"
    //       style={{ "borderRight": "solid black 1px" , "background": "#94A89A"}}
    //     >
    //       {sites.map((site, index) => <Tab key={site} label={`${site}`} id={`vertical-tab-${index}`} />)}
    //     </Tabs>

    //     {sites.map((site, index) => {
    //       return (
    //         <TabPanel key={site} value={value} index={index}>
    //           <DisplaySection key={site} props={{allSiteFiles, site, toggleModal}} />

    //           <ImgModal props={{ toggleModal, open }} />
    //         </TabPanel>
    //       );
          
    //     })}
    //   </div>
    // );
  // }
// }

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

export default Home;
