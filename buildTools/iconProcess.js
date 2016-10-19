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
    console.log('images', images);
    const image = project.files[images[0]];
    console.log(project.files[images[0]]);

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

    // async.series(
    //     [
    //         done => {
    //             const size = configs.builder.imageSizes.XXXH;
    //             resizeImage(image.path, path.join(project.projectPath, size.path), size.x, size.y, err => {
    //                 if(!err) {
    //                     console.log("icon success: xxxh");
    //                 }
    //                 return done(err);
    //             });
    //         },
    //     ],
    //     err => {
    //         if (err) {
    //             return cb(err);
    //         }
    //
    //         return cb();
    //     }
    // )
};