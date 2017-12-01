const gulp = require('gulp'),
  pug = require('gulp-pug'),
  concatenate = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  pump = require('pump'),
  stylus = require('gulp-stylus'),
  cleanCSS = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create();

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

gulp.task('server', () => {
  browserSync.init({
    server: './dist'
  });

  gulp.watch('./src/scripts/*.js', ['scripts']);
  gulp.watch('./src/stylus/**/*.styl', ['stylus']);
  gulp.watch('./src/views/**/*.pug', ['views']);

  gulp.watch('./dist/script.js').on('change', browserSync.reload);
  gulp.watch('./dist/style.css').on('change', browserSync.reload);
  gulp.watch('./dist/index.html').on('change', browserSync.reload);
});

gulp.task('watch', () => {
  gulp.watch('./src/scripts/*.js', ['scripts']);
  gulp.watch('./src/stylus/**/*.styl', ['stylus']);
  gulp.watch('./src/views/**/*.pug', ['views']);
})

gulp.task('default', ['server']);
gulp.task('build', ['views', 'stylus', 'scripts']);
