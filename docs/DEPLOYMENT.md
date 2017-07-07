# Deployment

### Build for production

Bundle your app. It will create `index.html`, `main.[hash].js`, `vendor.[hash].js` and `manifest.[hash].js`
```
yarn build
```

### Run your build
```
yarn prod
```

### Deploy

#### [Surge.sh](http://surge.sh)
```
surge ./dist -d subdomain.surge.sh
```

#### [Github Pages](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/)
```
mv dist docs
git add docs
git commit
git push upstream master
```

Then go to your repository, Settings -> Options -> Github Pages and select /docs folder

