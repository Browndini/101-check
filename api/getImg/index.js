import { config } from '../../config.js';
import pick from 'lodash/pick';
const projectId = 'novelty-1281';
const { Storage } = require('@google-cloud/storage');
const storage = new Storage({ projectId, keyFilename: config.keyFilename });
const bucket = storage.bucket(config.bucket);

export const getImg = async (req, res) => {
  try {
    const prefix = req.params.site.toLowerCase();
    const [items] = await bucket.getFiles({prefix});
    const files = items.map(imgData => {
      const fullName = imgData.metadata.name.split('/')[1].split('.')[0];
      const [layout, device, size] = fullName.split('-');
      const src = imgData.metadata.mediaLink;
      const imgInfo = { src, fullName, layout, device, size };
      const vals = pick(imgData.metadata.metadata, ['layoutUrl', 'genUrl', ...[ 'site', 'device', 'size', 'layout', 'dev']]);
      const obj = { ...imgInfo, ...vals };
      // console.log({ obj });
      return obj;
    }) || [];
    res.set('Access-Control-Allow-Origin', "*");
    res.json({ files , site: prefix });
  } catch(e) {
    console.error(e);
    res.json({});
  }
};
