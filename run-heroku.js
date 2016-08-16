var static = require('spa-express-static-server');

static.start({
  webRootPath: 'static',
  responseHeaders: {
    'Access-Control-Allow-Origin': 'https://hemmo-backend.herokuapp.com',
    'Access-Control-Allow-Credentials': 'true'
  }
});
