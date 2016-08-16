var static = require('spa-express-static-server');

static.start({
  webRootPath: 'static',
  responseHeaders: {
    'Access-Control-Allow-Credentials': 'http://hemmo-backend.herokuapp.com'
  }
});
