const async = require('async');
const lwip = require("lwip");
const path = require('path');
const configs = require("../config/config");

let resizeImage = (inputPath, outputPath, x, y, cb) => {
    lwip.open(inputPath, (err, image) => {
        if (err) {
            return cb(err);
        }

        image.batch().resize(x, y).writeFile(outputPath, err => {
            if (err) {
                return cb(err);
            }

            return cb();
        });
    });
};

module.exports = project => cb => {

    const images = Object.keys(project.files).filter(i => i.indexOf('icon') !== -1);
    const image = project.files[images[0]][0];

    if(configs.builder.imageSizes.length === 0 ) {
        return cb();
    }

    async.mapLimit(configs.builder.imageSizes, 10,
        (imageSize, innerCb) => {
            resizeImage(image.path, path.join(project.projectPath, imageSize.path), imageSize.width, imageSize.height, err => {
                if (!err) {
                    console.log("icon success");
                }
                return innerCb(err);
            })
        },
        err => {
            if (err) {
                return cb(err);
            }

            return cb();
        }
    );
};