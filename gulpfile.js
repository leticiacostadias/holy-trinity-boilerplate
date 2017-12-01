const gulp     = require('gulp'),
  pug          = require('gulp-pug'),
  concatenate  = require('gulp-concat'),
  uglify       = require('gulp-uglify'),
  pump         = require('pump'),
  stylus       = require('gulp-stylus'),
  cleanCSS     = require('gulp-clean-css'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync  = require('browser-sync').create(),
  svgSprite    = require('gulp-svg-sprite'),
  svgmin       = require('gulp-svgmin'),
  imagemin     = require('gulp-imagemin'),
  tinify       = require('gulp-tinify');

const src = {
  js: './src/scripts/*.js',
  pug: './src/views/*.pug',
  stylus: './src/stylus/style.styl',
  svg: './src/assets/icons/**/*.svg',
  img: './src/assets/img/**/*'
};
const dist = {
  path: './dist',
  js: './dist/script.js',
  html: './dist/index.html',
  css: './dist/style.css',
  assets: './dist/assets'
};
const defaultWatch = () => {
  gulp.watch(src.js, ['scripts']);
  gulp.watch('./src/stylus/**/*.styl', ['stylus']);
  gulp.watch(src.pug, ['views']);
  gulp.watch(src.img, ['images']);
  gulp.watch(src.svg, { ignoreInitial: false }, ['sprites']);
};
const configSvg = {
  mode: {
    symbol: {
        dest: '',
        sprite: 'sprite.svg',
        example: true
    }
  },
  svg: {
    xmlDeclaration: false,
    doctypeDeclaration: false
  }
};

gulp.task('sprites', (cb) => {
    pump([
      gulp.src(src.svg),
      svgmin(),
      svgSprite(configSvg),
      gulp.dest(dist.assets)
    ], cb);
});

gulp.task('images', () => {
  gulp.src(src.img)
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5
    }))
    .pipe(gulp.dest(dist.assets))
});

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

gulp.task('watch', defaultWatch);

gulp.task('default', ['server']);
gulp.task('build', ['views', 'stylus', 'scripts']);
