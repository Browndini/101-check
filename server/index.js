const locationID = 'kb-img',
  projectId = 'novelty-1281',
  keyFilename = './config.json';

const express = require("express");
const fs = require("fs");
const tinify = require("tinify");
const cors = require('cors');
const app = express();
const puppeteer = require('puppeteer');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ projectId, keyFilename });
const bucket = storage.bucket(locationID);
const getPublicUrl = (fileName) => ({ src: `https://storage.googleapis.com/${locationID}/${decodeURIComponent(fileName)}` });

tinify.key = "Zw80Q3kV6YByLshNw1JdWbl8CBWQyRTd";


let experiences = {
  desktop: {
    big: {
      width: 1920,
      height: 1450,
      deviceScaleFactor: 1,
    },
    small: {
      width: 800,
      height: 1650,
      deviceScaleFactor: 1,
    },
    medium: {
      width: 1080,
      height: 1650,
      deviceScaleFactor: 1,
    }
  },
  mobile: {
    iphone: {}
  }
};
let siteTests = {
  s101: {
    newnext: 'https://www.science101.com/25-of-the-spookiest-underwater-creatures-youll-ever-see/?utm_content=newnext&utm_source=talas&cool',
    newnext2: 'https://www.science101.com/25-of-the-spookiest-underwater-creatures-youll-ever-see/2?utm_content=newnext&utm_source=talas&cool'
  },
  h101: {
    newnext: 'https://www.history101.com/unsettling-historical-photos/?utm_content=newnext&utm_source=talas&cool',
    newnext2: 'https://www.history101.com/unsettling-historical-photos/2?utm_content=newnext&utm_source=talas&cool'
  },
  a101: {
    newnext: 'https://www.autos101.com/gearheads/worst-pickup-trucks/?utm_content=newnext&utm_source=talas&cool',
    newnext2: 'https://www.autos101.com/gearheads/worst-pickup-trucks/2?utm_content=newnext&utm_source=talas&cool'
  },
  l101: {
    newnext: 'https://www.living101.com/love-lives-of-the-game-of-thrones-cast/?utm_content=newnext&utm_source=talas&cool',
    newnext2: 'https://www.living101.com/love-lives-of-the-game-of-thrones-cast/2?utm_content=newnext&utm_source=talas&cool'
  },
  ip: {
    newnext: 'https://www.icepop.com/colleges-universities-arent-worth-tuition/?utm_content=newnext&utm_source=talas&cool',
    newnext2: 'https://www.icepop.com/colleges-universities-arent-worth-tuition/2?utm_content=newnext&utm_source=talas&cool'
  },
  de: {
    newnext: 'https://www.directexpose.com/final-photo-history-icons/?utm_content=newnext&utm_source=talas&cool',
    newnext2: 'https://www.directexpose.com/final-photo-history-icons/2?utm_content=newnext&utm_source=talas&cool'
  },
  tb: {
    newnext: 'https://www.tiebreaker.com/nba-celebrity-fans/?utm_content=newnext&utm_source=talas&cool',
    newnext2: 'https://www.tiebreaker.com/nba-celebrity-fans/2?utm_content=newnext&utm_source=talas&cool'
  },
  f101: {
    newnext: 'https://www.finance101.com/meal-kit/?utm_content=newnext&utm_source=talas&cool',
    newnext2: 'https://www.finance101.com/meal-kit/2?utm_content=newnext&utm_source=talas&cool'
  }
};

// TODO: convert to use this data structure
let sample = {
  f101: {
    url: 'https://www.finance101.com/',
    contentTypes: ['newnext', 'feed'],
    sourceTypes: ['talas', 'ouins', 'faok'],
    other: ['cool=1'],
    pagination: [
      { newnext: ['1', '2'] },
    ],
  }
};

const sites = Object.keys(siteTests);

app.set("port", process.env.PORT || 3001);

if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

app.get("/create/img/:item", async (req, res) => {
  let found = sites.find(site => site === req.params.item.toLowerCase()) || 's101';
  const tinyCount = tinify.compressionCount;
  await sss(found, tinyCount);
  res.json({done: true});
})

app.get("/img/:item", async (req, res) => {
  let site = sites.find(site => site === req.params.item.toLowerCase());
  let prefix = req.params.item.toLowerCase();
  let [items] = await bucket.getFiles({prefix});
  let files = items.map(s => getPublicUrl(s.id)) || [];

  res.json({ files, site });
});

app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});

async function sss(site, tinyCount) {
  // for (var site in siteTests) {
    for (var layout in siteTests[site]) {
      let layoutUrl = siteTests[site][layout];

      for (var device in experiences) {
        for (var size in experiences[device]) {
          const imgName = `${layout}-${device}-${size}.png`;
          const fileName = `../public/img/${site}/${imgName}`;
          const iPhone = puppeteer.devices['iPhone 6'];
          const browser = await puppeteer.launch();
          const context = await browser.createIncognitoBrowserContext();
          const page = await context.newPage();
          // console.log(`creating image: ${fileName}`);
          try {
            if (device === 'mobile') {
              await page.emulate(iPhone);
              await page.goto(layoutUrl);
              await page.waitFor(() => !!document.querySelector('#rect-mid-1 > div'));
            }
            
            else {
              await page.setViewport(experiences[device][size]);
              await page.goto(layoutUrl);
              if (layout !== 'newnext2') {
                await page.waitFor(() => !!document.querySelector('#leader-bot-center-1 > div'), { timeout: 2000 });
              } else {
                await page.waitFor(() => !!document.querySelector('#leader-top-center-1 > div'), { timeout: 2000 });
              }
              if (size !== 'small') {
                await page.waitFor(() => !!document.querySelector('#halfpage-mid-right-1 > div'), { timeout: 2000 });
              }
            }
          } catch(e) {
            console.log('>>>>>> failed to wait for ads after 2 sec <<<<<<');
          }

          await page.waitFor(3000);
          await page.screenshot({path: fileName, fullPage: true});

          console.log('tiny count: ', tinyCount);
          if(tinyCount && tinyCount <= 400) {
            console.log('makin more: ', tinyCount);
            let makeTiny = await tinify.fromFile(fileName);
            await makeTiny.toFile(fileName);
          }

          const file = bucket.file(`${site}/${imgName}`);
          fs.createReadStream(fileName)
          .pipe(file.createWriteStream())
          .on('error', function(err) {
            console.log('woooo error....');
          })
          .on('finish', function() {
            console.log('uploaded image: ',fileName);
          });

          // console.log('img', image);
          // const file = bucket.file('image');
          // console.log( 'before...');
          // const stream = file.createWriteStream({
          //   metadata: {
          //     contentType: 'image/png'
          //   },
          //   public: true,
          //   resumable: false
          // });
          // // console.log(stream);
          // stream.on('error', (err) => {
          //   console.log('faoled there...');
          // });
          // stream.on('finish', () => {
          //   console.log('up there...');
          //   // req.file.cloudStorageObject = gcsname;
          //   // file.makePublic().then(() => {
          //     // req.file.cloudStoragePublicUrl = getPublicUrl(gcsname);
          //     // next();
          //   // });
          // });
          await browser.close();
        }
      }
    // }
  }
}
