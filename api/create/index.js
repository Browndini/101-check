import { config } from '../../config';

const locationID = config.bucket;
const projectId = 'novelty-1281';

const { experiences, siteTests } = require('./img-config');

const imageMin = require('imagemin');
const imageMinPngQuant = require('imagemin-pngquant');

const puppeteer = require('puppeteer');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ projectId, keyFilename: config.keyFilename });
const bucket = storage.bucket(locationID);

const jumble = (str) => {
    const smaller = str.split('').filter((j, i) => i % 3 === 0);
    return smaller.map((v, i) => i % 2 ? v.toLowerCase() : v.toUpperCase()).join('');
};

process.setMaxListeners(Infinity);

let browser;

export const siteCheck = async (req, res) => {

  if (!browser) {
    browser = await puppeteer.launch({ headless: true, ignoreHTTPSErrors: true, args: ['--no-sandbox', '--disable-setuid-sandbox']})
  }
  const data = req.params;

  const created = await check(data);

  res.type('application/json');
  res.set('Access-Control-Allow-Origin', "*");
  if (typeof created === 'object') {
    res.json({data, ...created});
  } else {
    res.json({data, ...created});
  }
};
const disableIas = async (page) => {
  await page.evaluate(() => {
    window.deApp.disableIas();
    window.document.location.reload();
  });
};
async function check(requestInfo) {
  const { site, device, size, layout, dev } = requestInfo;
  const bust = jumble(require('uuid').v4().replace(/-/g, ''));
  const layoutUrl = `${siteTests[site][layout]}&bust=${bust}${dev ? '&dev=1': ''}`;

  const imgName = `${layout}-${device}-${size}${dev ? '-dev': ''}.png`;

  try {
    const iPhone = puppeteer.devices['iPhone 6'];
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    console.log({ layoutUrl });

    if (device === 'mobile') {
      await page.emulate(iPhone);
      await page.goto(layoutUrl);
      await disableIas(page);

      // await page.waitFor(() => !!document.querySelector('#rect-mid-1 > div'));
    } else {
      await page.setViewport(experiences[device][size]);
      await page.goto(layoutUrl);
      await disableIas(page);

      // switch(size) {
      //   case 'large':
      //     await page.waitFor(() => !!document.querySelector('#rect-top-right-1 > div'), { timeout: 8000 });
      //     await page.waitFor(() => !!document.querySelector('#halfpage-mid-right-1 > div'), { timeout: 8000 });
      //   case 'small':
      //   case 'medium':
      //   default:
      //     if (layout === 'newnext2') {
      //       await page.waitFor(() => !!document.querySelector('#leader-top-center-1 > div'), { timeout: 8000 });
      //     } else {
      //       await page.waitFor(() => !!document.querySelector('#leader-bot-center-1 > div'), { timeout: 8000 });
      //     }
      //     break;
      // }
    }

    await page.waitFor(10000);

    // show boxes where ads were rendered
    // problem: doesn't show the squares as transparent but they should be
    // await page.evaluate(() => {
    //   [...document.querySelectorAll('[data-google-query-id]')].forEach((s) => {
    //     if (s.id === 'pos1x1-head-1') return;
    //     if (s.id === 'pos1x1-foot-1') return;
    //     console.log('da id', s.id);
    //     let p = document.createElement('div');
    //     s.style.cssText = 'position: relative;';
    //     p.style.cssText = `
    //       font-size: 12px;
    //       position: absolute;
    //       top: 0px;
    //       left: 0px;
    //       width: 100%;
    //       height: 100%;
    //       overflow-wrap: break-word;
    //       padding: 10px;
    //       background: rgba(20,20,255,.1);
    //       display: flex;
    //       align-items: center;
    //       word-break: break-all;
    //     `;
    //
    //     p.append(s.firstElementChild.id);
    //     s.appendChild(p);
    //   })
    //   return;
    // });

    const metadata = {
      metadata: {
        layoutUrl,
        ...requestInfo,
        genUrl: `/${site}/${device}/${size}/${layout}/${dev ? 'dev' : ''}`
      }
    };

    const file = bucket.file(`${site}/${imgName}`);
    const image = await page.screenshot({
      fullPage: true
    });
    const imageCompressed = await imageMin.buffer(image, {
      plugins: [
        imageMinPngQuant({
          quality: [0.6, 0.8]
        })
      ]
    });

    await file.save(imageCompressed);
    await file.setMetadata(metadata);
    await page.goto('about:blank');
    await page.close();
    await context.close();

    const status = { created: `${site}/${imgName}`, done: true };
    console.log('%o', { status, ...metadata.metadata });
    return status;
  } catch (error) {
    return { error, done: false };
  }
}
