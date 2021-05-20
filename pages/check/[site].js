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
import Typography from '@material-ui/core/Typography';
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

const Index = ({ imgs, site }) => {
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
        <Typography variant="h6" gutterBottom>
                  <a href="#!">Looki</a>
        </Typography>
      </div>
      <nav>
        <div className="nav-mobile"><a id="nav-toggle" href="#!"><span></span></a></div>
        <ul className="nav-list">
          <li>
            <ul>
              <li>
              <Button aria-controls="simple-menu" variant="contained" aria-haspopup="true" onClick={handleClick}>
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
          </li>
        </ul>
      </nav>
      </div>
    </section>,
    <section key="content" className="home-container">
      <DisplaySection {...{ site, imgs }} />
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
  let imgs = [];
  const obj = { site, imgs };
  return {...obj, ...await fetchImages(site) };
}

export default Index;
