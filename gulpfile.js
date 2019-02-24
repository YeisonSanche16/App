const gulp = require('gulp');
const gulpMerge = require('gulp-merge');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const es = require('event-stream');
const babel = require('gulp-babel');
const inject = require('gulp-inject');
const eslint = require('gulp-eslint');
const sassLint = require('gulp-sass-lint');
const handlebars = require('gulp-handlebars');
const declare = require('gulp-declare');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('clean', () => gulp.src('dist', { read: false }).pipe(clean()));

gulp.task('browserSync', () => browserSync({
  server: {
    baseDir: 'dist',
  },
}));

gulp.task('css', () => gulp.src('app/**/*.scss')
  .pipe(sassLint())
  .pipe(sassLint.format())
  .pipe(sassLint.failOnError())
  .pipe(sass().on('error', sass.logError))
  .pipe(concat('style.css'))
  .pipe(gulp.dest('dist')));

gulp.task('js', () => gulp.src('app/js/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/env'],
  }))
  .pipe(concat('all.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest('dist')));

gulp.task('dev', () => {
  const target = gulp.src('./app/index.html');
  const cssStream = gulp.src('dist/**/*.css');
  const jsStream = gulp.src('dist/**/*.js');
  return target
    .pipe(inject(es.merge(cssStream, jsStream), { ignorePath: 'dist' }))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
  gulp.watch('app/**/*.html', ['dev']);
  gulp.watch('app/**/*.scss', ['css', 'dev']);
  gulp.watch('app/**/*.js', ['js', 'dev']);
});

gulp.task('default', (callback) => {
  runSequence('clean', 'browserSync', ['css', 'js'], 'dev', 'watch', callback);
});
