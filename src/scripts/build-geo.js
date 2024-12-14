/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-console */
try {
  require('dotenv').config();
} catch (e) {
  console.error('Failed to load dotenv:', e.message);
  process.exit(1);
}

const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');
const tar = require('tar');

if (process.env.VERCEL) {
  console.log('Vercel environment detected. Skipping geo setup.');
  process.exit(0);
}

const db = 'GeoLite2-City';

let url = `https://raw.githubusercontent.com/GitSquared/node-geolite2-redist/master/redist/${db}.tar.gz`;

if (process.env.MAXMIND_LICENSE_KEY) {
  url =
    `https://download.maxmind.com/app/geoip_download` +
    `?edition_id=${db}&license_key=${process.env.MAXMIND_LICENSE_KEY}&suffix=tar.gz`;
}

const dest = path.resolve(__dirname, '../geo');

if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest);
}

const download = url =>
  new Promise(resolve => {
    https.get(url, res => {
      resolve(res.pipe(zlib.createGunzip({})).pipe(tar.t()));
    });
  });

download(url).then(
  res =>
    new Promise((resolve, reject) => {
      res.on('entry', entry => {
        if (entry.path.endsWith('.mmdb')) {
          const filename = path.join(dest, path.basename(entry.path));
          const writeStream = fs.createWriteStream(filename);
          
          writeStream.on('error', (error) => {
            console.error('Error writing file:', error);
            reject(error);
          });

          entry.pipe(writeStream);
          console.log('Saved geo database:', filename);
        }
      });

      res.on('error', e => {
        console.error('Error during download:', e);
        reject(e);
      });
      
      res.on('finish', () => {
        console.log('Download completed successfully');
        resolve();
      });
    }),
).catch(error => {
  console.error('Failed to download or extract database:', error);
  process.exit(1);
});