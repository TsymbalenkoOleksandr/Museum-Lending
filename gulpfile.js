var gulp         = require('gulp'),
    scss         = require('gulp-scss'),
    browserSync  = require('browser-sync'),
    // uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    // rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    wiredep = require('wiredep').stream;
;

gulp.task('bower', function () {
  var options = {
    bowerJson: require('./bower.json'),
    directory:  'app/libs'
  };
  gulp.src('./app/index.html')
  .pipe(wiredep(options))
  .pipe(gulp.dest('./app'));
});

//for transformatin scss in css
gulp.task('scss', function() {
  return gulp.src('app/scss/*.scss')
  .pipe(scss())
  .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
  .pipe(gulp.dest('app/css'))
  .pipe(browserSync.reload({stream: true}));
});

//create server with livereload
gulp.task('browser-sync', function(){
  browserSync({
    server:{
      baseDir:'app'
    },
    notify: false //delete dreadful text))
  });
});

//delete folder dist 
gulp.task('clean', function(){
  return del.sync('dist');
});

//for clearning cache
gulp.task('clear', function(){
  return cache.clearAll();
});


// gulp.task('scripts', function(){
//  return gulp.src(
//    'app/libs/jquery/dist/jquery.min.js'
//   )
//  .pipe(uglify())
//  .pipe(gulp.dest('dist/js'));
// });

//minimization css but before transform scss
gulp.task('cssmin',['scss'], function(){
  return gulp.src(
    'app/css/style.css'
  )
  .pipe(cssnano())
  .pipe(gulp.dest('app/css'));
});

gulp.task('img', function(){
  return gulp.src('app/img/**/*')
  .pipe(cache(imagemin({ //using cache when will be minimization
    interlaced: true,
    progressive: true,
    svgoPlugins: [{removeViewBox: false}], //with svg image
    uno: [pngquant()]
  })))
  .pipe(gulp.dest('dist/img'));
});

//for watching when creating project
gulp.task('watch', ['browser-sync', 'bower', 'scss'], function() { 
  gulp.watch('bower.json', ['bower']);
  gulp.watch('app/scss/**/*.scss',['scss']);
  gulp.watch('app/*.html',browserSync.reload);
  gulp.watch('app/js/**/*.js',browserSync.reload);
  gulp.watch('app/css/**/*.css',browserSync.reload);
});

// for building project in folder dist
//!!!! ---- Try to not forgot about adding script if it will be
gulp.task('built', ['clean', 'img','cssmin'], function(){

  var buildJs  = gulp.src('app/js/**/*')
  .pipe(gulp.dest('dist/js'));

  var buildfonts  = gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'));

  var buildlibs  = gulp.src('app/libs/**/*')
  .pipe(gulp.dest('dist/libs'));

  var builtCss = gulp.src('app/css/**/*')
  .pipe(gulp.dest('dist/css'));

  var builtHtml = gulp.src('app/*.html')
  .pipe(gulp.dest('dist'));

});

