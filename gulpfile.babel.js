import gulp from 'gulp';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import buffer from 'vinyl-buffer';
import gutil from 'gulp-util';
import gif from 'gulp-if';
import autoprefixer from 'autoprefixer';
import postcss from 'gulp-postcss';
import extreplace from 'gulp-ext-replace';
import precss from 'precss';
import cssnano from 'cssnano';
import imagemin from 'gulp-imagemin';


const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = 8000;

const SRC_DIR = './src';
const DIST_DIR = './dist';
const ASSETS_DIR = './assets';


gulp.task('build-js', () => {
  return browserify({
      entries: `${SRC_DIR}/main.js`,
      debug: true
    })
    .transform("babelify")
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(gif(NODE_ENV != 'development', uglify()))
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(`${DIST_DIR}/js`));
});

gulp.task('build-css', function () {
  return gulp.src(`${ASSETS_DIR}/styles/main.scss`)
    .pipe(sourcemaps.init())
    .pipe(postcss([precss, autoprefixer, cssnano]))
    .pipe(sourcemaps.write())
    .pipe(extreplace('.css'))
    .pipe(gulp.dest(`${DIST_DIR}/css`));
});

gulp.task('build-img', function () {
  return gulp.src(`${ASSETS_DIR}/images/**/*`)
    .pipe(imagemin({
        progressive: true
    }))
    .pipe(gulp.dest(`${DIST_DIR}/images`));
});

gulp.task('watch', () => {
  gulp.watch(`${SRC_DIR}/**/*.js`, ['build-js']);
  gulp.watch(`${ASSETS_DIR}/styles/**/*.scss`, ['build-css']);
  gulp.watch(`${ASSETS_DIR}/images/**/*`, ['build-img']);
})

gulp.task('default', ['watch', 'build-js', 'build-css', 'build-img']);

