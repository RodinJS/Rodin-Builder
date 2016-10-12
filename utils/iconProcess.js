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

    if (images.length === 0) {
        return cb();
    }

    const imagesMap = {
        M: "",
        H: "",
        XH: "",
        XXH: "",
        XXXH: ""
    };

    for(let i = 0; i < images.length; i ++) {
        let size = images[i].split('-')[1].toUpperCase();
        imagesMap[size] = images[i];
    }

    let sizes = Object.keys(imagesMap);
    for(let i = 0; i < sizes.length; i ++) {
        let j = 0;
        while(imagesMap[sizes[i]] === "" && j < sizes.length) {
            let tmp = i + j;
            if(tmp < sizes.length && imagesMap[sizes[tmp]] !== "") {
                imagesMap[sizes[i]] = imagesMap[sizes[tmp]];
            }

            tmp = i - j;
            if(tmp >= 0 && imagesMap[sizes[tmp]] !== "") {
                imagesMap[sizes[i]] = imagesMap[sizes[tmp]];
            }
            j ++;
        }
    }

    async.series(
        [
            /***
             * XXXH high image
             */
            done => {
                const size = configs.builder.imageSizes.XXXH;
                const image = project.files[imagesMap.XXXH][0];
                resizeImage(image.path, path.join(project.projectPath, size.path), size.x, size.y, err => {
                    if(!err) {
                        console.log("icon success: xxxh");
                    }
                    return done(err);
                });
            },

            /**
             * XH high image
             */
            done => {
                const size = configs.builder.imageSizes.XXH;
                const image = project.files[imagesMap.XXH][0];
                resizeImage(image.path, path.join(project.projectPath, size.path), size.x, size.y, err => {
                    if(!err) {
                        console.log("icon success: xxh");
                    }
                    return done(err);
                });
            },

            /**
             * extra high image
             */
            done => {
                const size = configs.builder.imageSizes.XH;
                const image = project.files[imagesMap.XH][0];
                resizeImage(image.path, path.join(project.projectPath, size.path), size.x, size.y, err => {
                    if(!err) {
                        console.log("icon success: xh");
                    }
                    return done(err);
                });
            },

            /**
             * high image
             */
            done => {
                const size = configs.builder.imageSizes.H;
                const image = project.files[imagesMap.H][0];
                resizeImage(image.path, path.join(project.projectPath, size.path), size.x, size.y, err => {
                    if(!err) {
                        console.log("icon success: h");
                    }
                    return done(err);
                });
            },

            /**
             * medium image
             */
            done => {
                const size = configs.builder.imageSizes.M;
                const image = project.files[imagesMap.M][0];
                resizeImage(image.path, path.join(project.projectPath, size.path), size.x, size.y, err => {
                    if(!err) {
                        console.log("icon success: m");
                    }
                    return done(err);
                });
            }
        ],
        err => {
            if (err) {
                return cb(err);
            }

            return cb();
        }
    )
};