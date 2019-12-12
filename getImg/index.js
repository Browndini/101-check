// to test locally
// for help https://cloud.google.com/functions/docs/functions-framework
// make sure you have a google config file
// add -> const keyFilename = '../config.json'
// change to -> const storage = new Storage({ projectId, keyFilename });
// finally run -> `npm start`

const locationID = 'kb-img',
  projectId = 'novelty-1281';

const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ projectId });
const bucket = storage.bucket(locationID);
const getPublicUrl = (src) => ({ src });

exports.helloWorld = async (req, res) => {
  let site = req.params[0].substring(1).toLowerCase();
  let [items] = await bucket.getFiles({prefix: site});
  let files = items.map(s => getPublicUrl(s.metadata.mediaLink)) || [];
  res.set('Access-Control-Allow-Origin', "*");
  res.json({ files , site });
};
