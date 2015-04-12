var gulp = require('gulp-npm-run')(require('gulp'), {
      exclude: ['test'],
      require: ['doc']
    }),
    del = require('del')
    bump = require('gulp-bump'),
    qunit = require('gulp-qunit'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename'),
    minimist = require('minimist'),
    deploy = require('gulp-gh-pages');

// Passing a version number
var knownOptions = {
  string: 'ver'
};
var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('default', ['sass', 'test', 'docs']);
gulp.task('docs', ['doc', 'docs-rename']);
gulp.task('build', ['sass', 'build-rename']);

// Lint Task
gulp.task('lint', function() {
  return gulp.src('./lib/dropkick.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
  return gulp.src('./lib/css/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('css'))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('bump', function(){
  gulp.src('./*.json')
  .pipe(bump())
  .pipe(gulp.dest('./'));
});

// USEAGE: gulp build-rename --ver 2.x.x
gulp.task('build-rename', function() {
  return gulp.src('./lib/dropkick.js')
    .pipe(rename('dropkick.' + options.ver + '.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js/'));
});

gulp.task('deploy', function() {
  return gulp.src('./docs/**/*').pipe(deploy());
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('./lib/dropkick.js', ['scripts']);
  gulp.watch('./lib/css/*.scss', ['sass']);
});

gulp.task("docs-rename", function() {
  setTimeout(function() { //ugh
    return del(['./docs/index.html'], function (err, deletedFiles) {
      return gulp.src('./docs/classes/Dropkick.html')
          .pipe(rename('index.html'))
          .pipe(replace("../", ''))
          .pipe(gulp.dest('./docs/'));
    });
  }, 4000);
});

gulp.task('test', function() {
  //TODO: fix
  // return gulp.src(['./tests/src/runner.html', './tests/src/iframe.html'])
  return gulp.src(['./tests/src/runner.html'])
    .pipe(qunit());
});
