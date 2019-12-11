const locationID = 'kb-img',
  projectId = 'novelty-1281';

const fs = require("fs");
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

const puppeteer = require('puppeteer');
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ projectId });
const bucket = storage.bucket(locationID);

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
    newnext: 'https://www.finance101.com/retire-abroad-cheap/?utm_content=newnext&utm_source=talas&cool',
    newnext2: 'https://www.finance101.com/retire-abroad-cheap/2?utm_content=newnext&utm_source=talas&cool'
  }
};


exports.helloWorld = async (req, res) => {
  let site = req.params[0].substring(1).toLowerCase();

  await siteCheck(site);

  res.set('Access-Control-Allow-Origin', "*");
  res.json({done: true});
};

async function siteCheck(site) {
  for (var layout in siteTests[site]) {
    let layoutUrl = siteTests[site][layout];

    for (var device in experiences) {
      for (var size in experiences[device]) {
        const imgName = `${layout}-${device}-${size}.png`;
        const filePath = `../public/img/${site}`;
        const fileName = `${filePath}/${imgName}`;
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


        imagemin([fileName], {
          destination: filePath,
          plugins: [
            imageminPngquant({
              quality: [0.6, 0.8]
            })
          ]
        })
        .finally(() => {
          sendImage({fileName, site, imgName});
        })

        await browser.close();
      }
    }
  }
}

function sendImage({fileName, site, imgName}) {
  const file = bucket.file(`${site}/${imgName}`);
  fs.createReadStream(fileName)
  .pipe(file.createWriteStream())
  .on('error', function(err) {
    console.log('woooo error....');
  })
  .on('finish', function() {
    console.log('uploaded image: ',fileName);
  });
}
