module.exports.userDir = '/root';
module.exports.projectsDir = 'projects';
module.exports.buildDir = 'app/build/outputs/apk';
module.exports.tempProjectName = 'Rodin';

module.exports.binContentType = 'application/vnd.android.package-archive';

module.exports.imageSizes = {
    M: {
        x: 48,
        y: 48,
        path: "app/src/main/res/mipmap-mdpi/ic_launcher.png"
    },
    H: {
        x: 72,
        y: 72,
        path: "app/src/main/res/mipmap-hdpi/ic_launcher.png"
    },
    XH: {
        x: 96,
        y: 96,
        path: "app/src/main/res/mipmap-xhdpi/ic_launcher.png"
    },
    XXH: {
        x: 144,
        y: 144,
        path: "app/src/main/res/mipmap-xxhdpi/ic_launcher.png"
    },
    XXXH: {
        x: 192,
        y: 192,
        path: "app/src/main/res/mipmap-xxxhdpi/ic_launcher.png"
    }
};

module.exports.cron = {
    binSender: "* * * * *"
};