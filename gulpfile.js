const gulp = require('gulp');
const apiDoc = require('gulp-apidoc');

gulp.task('apidoc', cb => {
    apiDoc({
        src: 'routes/',
        dest: 'public/apidoc/'
    }, cb);
});