// to test locally
// for help https://cloud.google.com/functions/docs/functions-framework
// make sure you have a google config file
// add -> const keyFilename = '../config.json'
// change to -> const storage = new Storage({ projectId, keyFilename });
// finally run -> `npm start`

const locationID = 'kb-img';
const projectId = 'novelty-1281';
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ projectId });
const bucket = storage.bucket(locationID);

exports.helloWorld = async (req, res) => {
  const prefix = req.params[0].substring(1).toLowerCase();
  const [items] = await bucket.getFiles({ prefix });
  const files = items.map(imgData => {
    const fullName = imgData.metadata.name.split('/')[1].split('.')[0]
    const [ layout, device, size ] = fullName.split('-');
    const src = imgData.metadata.mediaLink;

    return { src, fullName, layout, device, size };
  }) || [];

  res.set('Access-Control-Allow-Origin', "*");
  res.json({ files , site: prefix });
};
