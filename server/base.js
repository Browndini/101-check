let Combinatorics = require('js-combinatorics');

let siteObjects = {
  "f101": {
    "url": "https://www.finance101.com",
    "stories": [
      "celeb-chefs-who-cooked-up-million-dollar-empires",
      "baby-costs"
    ],
    "contentTypes": ["newnext"],
    "sourceTypes": ["talas", "ouins", "faok"],
    "other": ["cool=1"],
    "pagination": ["0", "1", "2"] 
  },
  "s101": {
    "url": "https://www.science101.com",
    "stories": [
      "25-of-the-spookiest-underwater-creatures-youll-ever-see"
    ],
    "contentTypes": ["newnext"],
    "sourceTypes": ["talas", "ouins", "faok"],
    "other": ["cool=1"],
    "pagination": ["0", "1", "2"] 
  }
};

exports.sites = () => {
  let m = new Map();
  Object.keys(siteObjects).map(site => {
    let sObj = siteObjects[site];
    let comboBreaker = Combinatorics.cartesianProduct(sObj.stories, sObj.pagination, sObj.contentTypes, sObj.sourceTypes,  sObj.other);
    let nArr = comboBreaker.toArray().map(siteArr => {
      let retArr = '';
      if(siteArr[1] === '0') {
        siteArr.splice(1, 1);
        let f = siteArr.shift() + "/?" + "utm_content=" + siteArr.shift() + "&utm_source=" + siteArr.shift();

        retArr = f + '&' + siteArr.join('&');
      } else {
        let f = siteArr.shift() + '/' + siteArr.shift() + "/?" + "utm_content=" + siteArr.shift() + "&utm_source=" + siteArr.shift();

        retArr = f + '&' + siteArr.join('&');
      }

      return retArr;
    })
    console.log(nArr);
    // siteObjects[site].stories.map(story => {
    //   let imgKey = story;


    // })
  })
  // .stories.map((story) => {
  // let baseUrl = `${siteObjects[site]}/${story}/`;
  // });
  return new Map([['cool','d']]);
};
