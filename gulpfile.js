const gulp = require('gulp'),
  pug = require('gulp-pug'),
  gls = require('gulp-live-server')
  concatenate = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  pump = require('pump'),
  cleanCSS = require('gulp-clean-css'),
  stylus = require('gulp-stylus');

gulp.task('concat', () => (
  gulp.src('./src/scripts/*.js')
    .pipe(concatenate('script.js'))
    .pipe(gulp.dest('./dist/'))
));

gulp.task('compress', (cb) => {
  pump([
        gulp.src('dist/script.js'),
        uglify(),
        gulp.dest('dist')
    ],
    cb
  );
});

gulp.task('stylus', () => (
  gulp.src('./src/stylus/style.styl')
    .pipe(stylus({
      compress: true
    }))
    .pipe(gulp.dest('./dist'))
));
