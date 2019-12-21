// to test locally
// for help https://cloud.google.com/functions/docs/functions-framework
// make sure you have a google config file
// add -> const keyFilename = '../config.json'
// change to -> const storage = new Storage({ projectId, keyFilename });
// finally run -> `npm start`

// changing wait times, 9 min is the max timeout

// gcloud app deploy --version 20191218t155353 --no-promote app.yaml

const locationID = 'kb-img';
const projectId = 'novelty-1281';
const keyFilename = './config.json'
const { experiences, siteTests } = require('./img-config');

const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

const puppeteer = require('puppeteer');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ projectId, keyFilename });
const bucket = storage.bucket(locationID);

const express = require('express');
const app = express();
const port = 8080;

app.get('/:site/:device/:size/:layout', async (req, res) => {
  
  const data = req.params;
  const created = await siteCheck(data);
  // const created = {cool:'yup'};

  res.type('application/json');
  res.set('Access-Control-Allow-Origin', "*");
  if(typeof created === 'object') {
    res.json({data, ...created});
  } else {
    res.json({data, ...created});
  }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))


async function siteCheck({site, device, size, layout}) {
  const layoutUrl = siteTests[site][layout];
  const imgName = `${layout}-${device}-${size}.png`;

  
  try {
    const iPhone = puppeteer.devices['iPhone 6'];
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();

    if (device === 'mobile') {
      await page.emulate(iPhone);
      await page.goto(layoutUrl);
      await page.waitFor(1000);
      await page.waitFor(() => !!document.querySelector('#rect-mid-1 > div'));
    } else {
      await page.setViewport(experiences[device][size]);
      await page.goto(layoutUrl);
      await page.waitFor(1000);

      switch(size) {
        case 'large':
          await page.waitFor(() => !!document.querySelector('#rect-top-right-1 > div'), { timeout: 1000 });
          await page.waitFor(() => !!document.querySelector('#halfpage-mid-right-1 > div'), { timeout: 1000 });
        case 'small':
        case 'medium':
        default:
          if (layout === 'newnext2') {
            await page.waitFor(() => !!document.querySelector('#leader-top-center-1 > div'), { timeout: 1000 });
          } else {
            await page.waitFor(() => !!document.querySelector('#leader-bot-center-1 > div'), { timeout: 1000 });
          }
          break;
      }
    }

    const file = bucket.file(`${site}/${imgName}`);
    const image = await page.screenshot({ fullPage: true });
    const imageCompressed = await imagemin.buffer(image, {
      plugins: [
        imageminPngquant({
          quality: [0.6, 0.8]
        })
      ]
    });
  
  
    await file.save(imageCompressed);
    await browser.close();
    
    return { created: `${site}/${imgName}`, done: true };
  } catch(error) {
    return { error, done: false };
  }
}
