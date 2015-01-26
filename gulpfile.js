var autoprefixer 	= require('gulp-autoprefixer'),
		cache         = require('gulp-cache'),
		concat        = require('gulp-concat'),
		connect 			= require('gulp-connect'),
		del 					= require('del'),
		gulp 					= require('gulp')
		haml 					= require('gulp-haml'),
		imagemin      = require('gulp-imagemin'),
		livereload 		= require('gulp-livereload'),
		minifycss 		= require('gulp-minify-css'),
		notify        = require('gulp-notify'),
		rename 				= require('gulp-rename'),
		sass 					= require('gulp-ruby-sass'),
		uglify        = require('gulp-uglify'),
		vendor 				= require('gulp-concat-vendor');


gulp.task('pages', function () {
  gulp.src('src/*.haml')
    .pipe(haml())
    .pipe(gulp.dest('dist/'));
});

gulp.task('styles', function() {
	return sass('src/styles/main.sass', { sourcemap: false })
		.on('error', function (err) { console.log("ERROR: " + err.message); })
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(minifycss())
		.pipe(gulp.dest('dist/assets/css'))
		.pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('vendor', function(){
	return gulp.src('bower_components/*')
		.pipe(cache(vendor('vendor.js')))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/js/vendor/'));
});

gulp.task('scripts', function() {
	return gulp.src('src/scripts/**/*.js')
		.pipe(concat('main.js'))
		.pipe(gulp.dest('dist/assets/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('dist/assets/js'))
		.pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function() {
	return gulp.src('src/images/**/*')
		.pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
		.pipe(gulp.dest('dist/assets/img'))
		.pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function(cb) {
	del(['dist', 'dist/assets/css', 'dist/assets/js', 'dist/assets/img'], cb);
});

gulp.task('connect', function() {
  connect.server({
    port: 8989,
    livereload: true
  });
});

gulp.task('watch', function() {
	gulp.watch('src/*.haml', ['pages']);
  gulp.watch('src/styles/**/*.sass', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/images/**/*', ['images']);

  livereload.listen();
  gulp.watch(['dist/**']).on('change', livereload.changed);
});


// Kick off
gulp.task('default', ['clean', 'watch', 'connect'], function() {
	gulp.start('vendor', 'pages', 'styles', 'scripts', 'images');
});