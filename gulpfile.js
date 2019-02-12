var gulp = require('gulp')
var sass = require('gulp-sass')
var browserSync = require('browser-sync')
var useref = require('gulp-useref')
var uglify = require('gulp-uglify')
var uglifyes = require('gulp-uglify-es').default;
var gulpIf = require('gulp-if')
var cssnano = require('gulp-cssnano')
var imagemin = require('gulp-imagemin')
var cache = require('gulp-cache')
var del = require('del')
var runSequence = require('run-sequence')
var handlebars = require('handlebars')
var gulpHandlebars = require('gulp-handlebars-html')(handlebars)
var regexRename = require('gulp-regex-rename')
var replace = require('gulp-replace')
var babel = require('gulp-babel');

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    }
  })
})

gulp.task('sass', function() {
  return gulp.src('app/scss/**/*.scss') 
    .pipe(sass().on('error', sass.logError)) 
    .pipe(gulp.dest('app/css')) 
    .pipe(browserSync.reload({ 
      stream: true
    }))
})

gulp.task('compileHtml', function () {
  var templateData = {
  },
  options = {
      partialsDirectory: ['./app/templates/partials']
  }

  return gulp.src('./app/templates/' + '*.page.hbs')
             .pipe(gulpHandlebars(templateData, options))
             .pipe(regexRename(/\.page\.hbs$/, ".html"))
             .pipe(replace(/\uFEFF/ig, "")) 
             .pipe(gulp.dest('./app'));
})

gulp.task('watch', function() {
  gulp.watch('app/scss/**/*.scss', ['sass'])
  gulp.watch('./app/templates/**/*.hbs', ['compileHtml'])
  gulp.watch('app/*.html', browserSync.reload)
  gulp.watch('app/js/**/*.js', browserSync.reload)
})

gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', babel()))
    .pipe(gulpIf('*.js', uglifyes()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
})

gulp.task('images', function() {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/images'))
})

gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean', function() {
  return del.sync('dist').then(function(cb) {
    return cache.clearAll(cb)
  })
})

gulp.task('clean:dist', function() {
  return del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*'])
})

gulp.task('default', function(callback) {
  runSequence(['sass', 'browserSync'], 'watch', callback)
})

gulp.task('build', function(callback) {
  runSequence('clean:dist', 'sass', ['useref', 'images', 'fonts'], callback)
})