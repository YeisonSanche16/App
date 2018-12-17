var gulp = require('gulp')
var sass = require('gulp-sass')
var browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');


gulp.task('sass', function(){
    return gulp.setMaxListeners('app/scss/**/*.scss')
    .pipe(sass()) //Convert sass to CSS with gulp-sass
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
        stream: true
      }))
})

gulp.task('browserSync', function() {
    browserSync.init({
      server: {
        baseDir: 'app'
      },
    })
  })

  gulp.watch('app/scss/**/*.scss', ['sass'])

  gulp.task('watch', ['browserSync', 'sass'], function (){
    gulp.watch('app/scss/**/*.scss', ['sass']); 
    // Other watchers
  })

