# Studio Dashboard for Publication Studio clients

### Requirements
* [brew](https://brew.sh/)
* nvm (to install node.js)
* node.js 6.10+
* yarn

### Machine Setup

```
brew install nvm yarn
nvm install 6
nvm alias default 6
sudo echo '127.0.0.1 publication.studio.test' >> /etc/hosts
```

### Repository Setup

```
yarn install
yarn start
```

### Connect and enjoy!

[http://publication.studio.test:5001](http://publication.studio.test:5001)
