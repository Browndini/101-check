import React from 'react';
import Link from 'next/link'
import fetch from 'isomorphic-unfetch';
import Head from 'next/head'
import DisplaySection from '../DisplaySection';
import '../css/Home.css';
import { config } from '../../config';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const base = {
  imgs: [],
  generating: '',
  doneGenerating: false,
};

const siteFiles = {};

Object.keys(config.siteTests).forEach((exp) => {
  siteFiles[exp] = base;
});

const sites = Object.keys(siteFiles);

const Index = props => {
  const { imgs, site } = props;


  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
            <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
              {site}
            </Button>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {sites.map((site, index) => <MenuItem key={`menu-${site}`}
                onClick={() => {
                  handleClose();
                  document.location.href=`/check/${site}`;
                }}>{site}</MenuItem>)}
            </Menu>
          </li>
        </ul>
      </nav>
      </div>
    </section>,
    <section key="content" className="home-container">
      <DisplaySection props={{ site, imgs }} />
    </section>
  ]);
}

const fetchImages = async (site) => {
  const response = await fetch(`${config.fetchImages}/check-1/${site}`);
  const myJson = await response.json();
  let imgs = (myJson.files.length >= 0) ? myJson.files : [];

  return { imgs, site };
};

Index.getInitialProps = async (context) => {
  const { site } = context.query;
  return await fetchImages(site);
}

export default Index;
