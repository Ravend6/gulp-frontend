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
import plumber from 'gulp-plumber';
import grename from 'gulp-rename';


const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = 8000;

const SRC_DIR = './src';
const DIST_DIR = './dist';
const ASSETS_DIR = './assets';


gulp.task('build-js', wrapPipe(function(success, error) {
  return browserify({
      entries: `${SRC_DIR}/main.js`,
      debug: true
    })
    .transform('babelify')
    .bundle()
    .on('error', error)
    .pipe(source('bundle.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(`${DIST_DIR}/js`));
}));

gulp.task('build-css', wrapPipe(function(success, error) {
  return gulp.src(`${ASSETS_DIR}/styles/main.scss`)
    .pipe(sourcemaps.init())
    .pipe(postcss([precss, autoprefixer, cssnano]))
    .on('error', error)
    .pipe(sourcemaps.write())
    .pipe(grename('bundle.min.css'))
    .pipe(gulp.dest(`${DIST_DIR}/css`));
}));

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


function wrapPipe(taskFn) {
  return function (done) {
    var onSuccess = function () {
      done();
    };
    var onError = function (err) {
      done(err);
    }
    var outStream = taskFn(onSuccess, onError);
    if (outStream && typeof outStream.on === 'function') {
      outStream.on('end', onSuccess);
    }
  }
}
