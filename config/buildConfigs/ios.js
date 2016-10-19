module.exports.userDir = '/Users/administrator';
module.exports.projectsDir = 'Projects';
module.exports.buildDir = 'build';
module.exports.tempProjectName = 'Rodin';
module.exports.libDir = 'Library/MobileDevice/Provisioning Profiles';

module.exports.binContentType = 'application/octet-stream';

module.exports.uuidRegExp = new RegExp(/\<key\>UUID\<\/key\>\n[\t\s]+\<string>([a-zA-Z0-9\-]+)\<\/string\>/, 'gi');
module.exports.uuNameRegExp = new RegExp(/\<key\>Name\<\/key\>\n[\t\s]+\<string>([^\<]+)\<\/string\>/, 'gi');
module.exports.uuDevelopmentTeamRegExp = new RegExp(/\<key\>com\.apple\.developer\.team\-identifier\<\/key\>\n[\t\s]+\<string>([^\<]+)\<\/string\>/);

module.exports.imageSizes = {
    M: {
        x: 20,
        y: 20,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/m.png"
    },
    H: {
        x: 29,
        y: 29,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/h.png"
    },
    XH: {
        x: 40,
        y: 40,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/xh.png"
    },
    XXH: {
        x: 60,
        y: 60,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/xxh.png"
    },
    XXXH: {
        x: 83.5,
        y: 83.5,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/xxxh.png"
    }
};

module.exports.cron = {
    binSender: "* * * * *"
};