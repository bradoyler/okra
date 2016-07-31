var gulp = require('gulp')
var browserSync = require('browser-sync')
var nodemon = require('gulp-nodemon')

var BROWSER_SYNC_RELOAD_DELAY = 700

gulp.task('nodemon', function (cb) {
  var called = false
  return nodemon({
    script: 'bin/www',
    ext: 'json, js',
    watch: [ 'app.js', './routes', './services' ]
  })
    .on('start', function onStart () {
      // ensure start only got called once
      if (!called) { cb() }
      called = true
    })
    .on('restart', function onRestart () {
      // reload connected browsers after a slight delay
      setTimeout(function reload () {
        browserSync.reload({ stream: false })
      }, BROWSER_SYNC_RELOAD_DELAY)
    })
})

gulp.task('browser-sync', [ 'nodemon' ], function () {
  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync({
    proxy: 'http://localhost:3000',
    port: 4000,
    browser: [ 'google-chrome' ]
  })
})

gulp.task('bs-reload', function () {
  browserSync.reload()
})

gulp.task('default', [ 'browser-sync' ], function () {
  gulp.watch([ 'public/js/*.js' ], [ browserSync.reload ])
  gulp.watch('views/**/*.hbs', [ 'bs-reload' ])
})
