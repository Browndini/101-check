import { config } from '../../config';

const keyFilename = '../create/config.json';

const locationID = config.bucket;
const projectId = 'novelty-1281';
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ projectId, keyFilename });
const bucket = storage.bucket(locationID);

exports.helloWorld = async (req, res) => {
  const prefix = req.params.site.toLowerCase();
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
