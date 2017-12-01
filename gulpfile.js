const gulp = require('gulp'),
  pug = require('gulp-pug'),
  gls = require('gulp-live-server')
  concatenate = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  pump = require('pump'),
  stylus = require('gulp-stylus'),
  cleanCSS = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer');

gulp.task('scripts', (cb) => {
  pump([
    gulp.src('./src/scripts/*.js'),
    concatenate('script.js'),
    uglify(),
    gulp.dest('dist')
  ], cb);
});

gulp.task('stylus', (cb) => {
  pump([
    gulp.src('./src/stylus/style.styl'),
    stylus(),
    autoprefixer({
      browsers: ['last 2 versions', '> 1%', 'ie 9'],
      cascade: false
    }),
    cleanCSS(),
    gulp.dest('./dist')
  ], cb);
});

gulp.task('views', () => (
  gulp.src('./src/views/*.pug')
    .pipe(pug({
      verbose: true,
      pretty: true
    }))
    .pipe(gulp.dest('./dist'))
));

gulp.task('watch', () => {
  gulp.watch('./src/scripts/*.js', ['scripts']);
  gulp.watch('./src/stylus/**/*.styl', ['stylus']);
  gulp.watch('./src/views/**/*.pug', ['views']);
})

gulp.task('default', ['watch']);
