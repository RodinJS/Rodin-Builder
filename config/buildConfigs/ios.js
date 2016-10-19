module.exports.userDir = '/Users/administrator';
module.exports.projectsDir = 'Projects';
module.exports.buildDir = 'build';
module.exports.tempProjectName = 'Rodin';
module.exports.libDir = 'Library/MobileDevice/Provisioning Profiles';

module.exports.binContentType = 'application/octet-stream';

module.exports.uuidRegExp = new RegExp(/\<key\>UUID\<\/key\>\n[\t\s]+\<string>([a-zA-Z0-9\-]+)\<\/string\>/, 'gi');
module.exports.uuNameRegExp = new RegExp(/\<key\>Name\<\/key\>\n[\t\s]+\<string>([^\<]+)\<\/string\>/, 'gi');
module.exports.uuDevelopmentTeamRegExp = new RegExp(/\<key\>com\.apple\.developer\.team\-identifier\<\/key\>\n[\t\s]+\<string>([^\<]+)\<\/string\>/);


module.exports.imageSizes = [
    {
        width: 40,
        height: 40,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/iphone_20_2x.png"
    },
    {
        width: 60,
        height: 60,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/iphone_20_3x.png"
    },
    {
        width: 58,
        height: 58,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/iphone_29_2x.png"
    },
    {
        width: 87,
        height: 87,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/iphone_29_3x.png"
    },
    {
        width: 80,
        height: 80,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/iphone_40_2x.png"
    },
    {
        width: 120,
        height: 120,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/iphone_40_3x.png"
    },
    {
        width: 120,
        height: 120,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/iphone_60_2x.png"
    },
    {
        width: 180,
        height: 180,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/iphone_60_3x.png"
    },
    {
        width: 20,
        height: 20,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/ipad_20_1x.png"
    },
    {
        width: 40,
        height: 40,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/ipad_20_2x.png"
    },
    {
        width: 29,
        height: 29,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/ipad_29_1x.png"
    },
    {
        width: 58,
        height: 58,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/ipad_29_2x.png"
    },
    {
        width: 40,
        height: 40,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/ipad_40_1x.png"
    },
    {
        width: 80,
        height: 80,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/ipad_40_2x.png"
    },
    {
        width: 76,
        height: 76,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/ipad_76_1x.png"
    },
    {
        width: 152,
        height: 152,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/ipad_76_2x.png"
    },
    {
        width: 147,
        height: 147,
        path: "Rodin/Assets.xcassets/AppIcon.appiconset/ipad_83_5_2x.png"
    }
];
module.exports.cron = {
    binSender: "* * * * *"
};