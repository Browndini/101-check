// {
//   "name": "looki",
//   "script": "api/server.js",
//   "instances": "2",
//   "env": {
//     "NODE_ENV": "development"
//   },
//   "env_production" : {
//     "NODE_ENV": "production"
//   }
// }

// const mode = process.env.WATCH ? 'watch' : 'start';

const serve = {
  name      : `looki server`,
  script    : 'node',
  args      : `-r esm server.js`,
  cwd       : 'api',
  env: {
    "NODE_ENV": "development"
  },
  env_production : {
    "NODE_ENV": "production"
  }
};

const ui = {
  name      : `looki ui`,
  script    : 'npm',
  args      : `run dev`,
  env: {
    "NODE_ENV": "development"
  },
  env_production : {
    "NODE_ENV": "production"
  }
};

if (process.env.APP_INSTANCES) {
  serve.instances = process.env.APP_INSTANCES;
}

module.exports = {
  apps: [serve, ui]
};
