# hemmo-admin

## Package installation
```bash
$ npm install
```

## Use development server
webpack-dev-server is used as development server.
It monitors update files and rebuilds them automatically.
Note that this is not suitable for production use.

```bash
$ npm start
```

## Release build
To put compiled files into `static` directory, type the following command.
Note that this is automatically ran as a post-install hook after `npm install`.

```bash
$ npm run build
```

