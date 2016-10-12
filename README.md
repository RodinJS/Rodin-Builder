# Rodin Android app builder

## API

Check api documentation.

## Apps

Each app has appId and appSecret, which are required for connecting with service.

#### Create new app

For creating new app
```sh
$ node scripts/generateApp.js --name <new-app-name>
```

```--name``` is required.
 
This will create new app and give you ```appId``` nad ```appSecret```.
 
#### List all apps

For listing all apps
```sh
$ node scripts/listApps.js
```
