const environment = process.env.ENVIRONMENT || 'development';

export const env = {
  development: {
    bucket: '101-check',
    'generateImages': 'http://0.0.0.0:8080',
    'fetchImages': 'http://0.0.0.0:8080',
  },
  production: {
    bucket: 'kb-img',
    'generateImages': 'https://us-central1-novelty-1281.cloudfunctions.net/create-101-imgs',
    'fetchImages': 'https://us-central1-novelty-1281.cloudfunctions.net/',
  }
};

export const configGetter = () => env[environment];

export const config = configGetter();
