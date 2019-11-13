const express = require("express");
const fs = require("fs");
const cors = require('cors');
const app = express();
const puppeteer = require('puppeteer');

const sites = ['s101', 'f101', 'l101', 'h101', 'p101', 'v101', 'a101', 'tb'];
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
  // f101: {
  //   newnext: 'https://www.finance101.com/meal-kit/?utm_content=newnext&utm_source=talas&cool',
  //   newnext2: 'https://www.finance101.com/meal-kit/2?utm_content=newnext&utm_source=talas&cool'
  // }
};

app.set("port", process.env.PORT || 3001);

if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}

app.get("/create/img/:item", async (req, res) => {
  let found = sites.find(site => site === req.params.item.toLowerCase()) || 's101';
  await sss(found);
  res.json({done: true});
})

app.get("/img/:item", async (req, res) => {
  let found = sites.find(site => site === req.params.item.toLowerCase()) || 's101';
  await fs.readdir(`../public/img/${found}`, (err, items)=> {
    res.json({
      files: items,
      site: found
    });
  });
});


app.listen(app.get("port"), () => {
  console.log(`Find the server at: http://localhost:${app.get("port")}/`); // eslint-disable-line no-console
});

async function sss(site) {
  // for (var site in siteTests) {
    for (var layout in siteTests[site]) {
      let layoutUrl = siteTests[site][layout];

      for (var device in experiences) {
        for (var size in experiences[device]) {
          let fileName = `../public/img/${site}/${layout}-${device}-${size}.png`;
          const iPhone = puppeteer.devices['iPhone 6'];
          const browser = await puppeteer.launch();
          const context = await browser.createIncognitoBrowserContext();
          const page = await context.newPage();
          console.log(`creating image: ${fileName}`);

          if(device === 'mobile') {
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

          await page.waitFor(3000);
          await page.screenshot({path: fileName, fullPage: true});
          await browser.close();
        }
      }
    // }
  }
}
