import React, { useState } from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Link from 'next/link'
import fetch from 'isomorphic-unfetch';
import Head from 'next/head'
import DisplaySection from '../DisplaySection';
import '../css/Home.css';

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
  tabs: { "borderRight": "solid black 1px" , "background": "#94A89A" }
};
const sites = Object.keys(siteFiles);

const Index = props => {
  const { imgs, site } = props;
  const [ value, setValue ] = useState(0);  
  
  return ([
    <Head key="title">
      <title>{`Looki ${site}`}</title>
      <script src="/nav.js"></script>
    </Head>,
    <section key="nav" className="navigation">
      <div className="nav-container">
      <div className="brand">
        <a href="#!">Looki</a>
      </div>
      <nav>
        <div className="nav-mobile"><a id="nav-toggle" href="#!"><span></span></a></div>
        <ul className="nav-list">
          <li>
            <a href="#!">Sites</a>
            <ul className="nav-dropdown">
              {sites.map((site, index) => <li key={site} ><Link href={`/check/${site}`} ><a>{site}</a></Link></li>)}
            </ul>
          </li>
        </ul>
      </nav>
      </div>
    </section>,
    <section key="content" className="home-container">
      <DisplaySection props={{site, imgs}} />
    </section>
  ]);
}

function TabPanel(props) {
  const { children, value, site, ...other } = props;

  return (
    <div
      component="div"
      role="tabpanel"
      id={`vertical-tabpanel-${site}`}
      aria-labelledby={`vertical-tab-${site}`}
      {...other}
    >
      <div p={3}>{children}</div>
    </div>
  );
}


const fetchImages = async (site) => {
  const response = await fetch(`https://us-central1-novelty-1281.cloudfunctions.net/check-1/${site}`);
  const myJson = await response.json();
  let imgs = (myJson.files.length >= 0) ? myJson.files : [];

  return { imgs, site };
};

Index.getInitialProps = async (context) => {
  const { site } = context.query;
  return await fetchImages(site);
}

export default Index;
