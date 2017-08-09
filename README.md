# Rodin Builder

[![Greenkeeper badge](https://badges.greenkeeper.io/RodinJS/Rodin-Builder.svg?token=56bebeb7066b0ad3b17f55e288c149b292a41b42059930c9cb8450195d700296&ts=1502272746314)](https://greenkeeper.io/)

## API

Check api documentation [here](http://45.55.92.49:8001/apidoc/)
## Setup and Run

#### 1. Clone this repo 
```sh
$ git clone <repo url>
```

#### 2. Install dependencies for image manipulation

OS | Command
----- | -----
OS X | `brew install pkg-config cairo libpng jpeg giflib`
Ubuntu | `sudo apt-get install libcairo2-dev libjpeg8-dev libpango1.0-dev libgif-dev build-essential g++`
Fedora | `sudo yum install cairo cairo-devel cairomm-devel libjpeg-turbo-devel pango pango-devel pangomm pangomm-devel giflib-devel`
Solaris | `pkgin install cairo pkg-config xproto renderproto kbproto xextproto`
Windows | [Instructions on our wiki](https://github.com/Automattic/node-canvas/wiki/Installation---Windows)

**El Capitan and Sierra users:** If you have recently updated to El Capitan or Sierra and are experiencing trouble when compiling, run the following command: `xcode-select --install`. Read more about the problem [on Stack Overflow](http://stackoverflow.com/a/32929012/148072).

#### 3. Install node dependencies
```sh
$ cd <path/to/project>
$ npm install
```

#### 4. Run server for specific platform builder, use ```-p``` flag for running in specific port.

IOS
```sh
node app.js --ios -p 10000
```

Android
```sh
node app.js --android -p 10000
```

Oculus Rift
```sh
node app.js --oculus -p 10000
```

HTC Vive
```sh
node app.js --vive -p 10000
```

#### 5. Running with ```pm2```
There are specific json files in directory ```./pm2``` for running with pm2 and cluster mode. 
Change ports and run

IOS development and production modes
```sh
pm2 start pm2/ios.json
pm2 start pm2/ios-dev.json
```

## Apps

Each app has appId and appSecret, which are required for connecting with service.

#### Create new app

For creating new app for android builder
```sh
$ node scripts/generateApp.js --android --name <new-app-name>
```

```--name``` is required.
 
This will create new app and give you ```appId``` nad ```appSecret```.

#### List all apps

For listing all apps
```sh
$ node scripts/listApps.js --android
```
