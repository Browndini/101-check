// to test locally
// for help https://cloud.google.com/functions/docs/functions-framework
// make sure you have a google config file
// add -> const keyFilename = '../config.json'
// change to -> const storage = new Storage({ projectId, keyFilename });
// finally run -> `npm start`

// changing wait times, 9 min is the max timeout

const locationID = 'kb-img';
const projectId = 'novelty-1281';

const { experiences, siteTests } = require('./img-config');

const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

const puppeteer = require('puppeteer');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ projectId });
const bucket = storage.bucket(locationID);

exports.helloWorld = async (req, res) => {
  const [site, device, size, layout] = req.params[0].substring(1).toLowerCase().split('/');
  const done = await siteCheck({site, device, size, layout});

  res.set('Access-Control-Allow-Origin', "*");
  res.json({done: !!done, site, device, size, layout, created: !!done && done});
};

async function siteCheck({site, device, size, layout}) {
  const layoutUrl = siteTests[site][layout];
  const imgName = `${layout}-${device}-${size}.png`;

  const iPhone = puppeteer.devices['iPhone 6'];
  const browser = await puppeteer.launch({args: ['--no-sandbox']});
  const context = await browser.createIncognitoBrowserContext();
  const page = await context.newPage();

  try {
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
  } catch(e) {
    return false;
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
  
  return `${site}/${imgName}`;
}
