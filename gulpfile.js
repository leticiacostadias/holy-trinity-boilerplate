const gulp = require('gulp'),
  pug = require('gulp-pug'),
  concatenate = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  pump = require('pump'),
  stylus = require('gulp-stylus'),
  cleanCSS = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create();

const src = {
  js: './src/scripts/*.js',
  pug: './src/views/*.pug',
  stylus: './src/stylus/style.styl'
};
const dist = {
  path: './dist',
  js: './dist/script.js',
  html: './dist/index.html',
  css: './dist/style.css'
};
const defaultWatch = () => {
  gulp.watch(src.js, ['scripts']);
  gulp.watch('./src/stylus/**/*.styl', ['stylus']);
  gulp.watch('./src/views/**/*.pug', ['views']);
};

gulp.task('scripts', (cb) => {
  pump([
    gulp.src(src.js),
    concatenate('script.js'),
    uglify(),
    gulp.dest(dist.path)
  ], cb);
});

gulp.task('stylus', (cb) => {
  pump([
    gulp.src(src.stylus),
    stylus(),
    autoprefixer({
      browsers: ['last 2 versions', '> 1%', 'ie 9'],
      cascade: false
    }),
    cleanCSS(),
    gulp.dest(dist.path)
  ], cb);
});

gulp.task('views', () => (
  gulp.src(src.pug)
    .pipe(pug({
      verbose: true,
      pretty: true
    }))
    .pipe(gulp.dest(dist.path))
));

gulp.task('server', () => {
  browserSync.init({
    server: dist.path
  });

  defaultWatch();
  gulp.watch([dist.js, dist.html, dist.css]).on('change', browserSync.reload);
});

gulp.task('watch', () => {
  defaultWatch()
})

gulp.task('default', ['server']);
gulp.task('build', ['views', 'stylus', 'scripts']);
