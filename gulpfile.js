"use strict";

const gulp = require("gulp");
const browserify = require("gulp-browserify");
const rename = require("gulp-rename");
const mocha = require("gulp-mocha");
require("babel-register");

gulp.task("build", () => {
  gulp.src("src/**/*.js")
    .pipe(browserify({
          "transform": ["babelify"]
      }))
    .pipe(rename("app.js"))
    .pipe(gulp.dest("./dist"));
});

gulp.task("test", () => {
  return gulp.src(["test/**/*Spec.js", "test/testHelper.js"], { read: false })
    .pipe(mocha());
})

gulp.task('watch', function() {
	gulp.watch("src/**/*.js", ["build"]).on('change', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});
