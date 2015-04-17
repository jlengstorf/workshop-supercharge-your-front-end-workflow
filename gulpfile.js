/*
 * # Task Automation Using Gulp
 *
 * Task runners are designed to handle the boring, repetitive jobs that we, as 
 * easily-bored, often-busy developers, tend to forget.
 *
 * Fortunately, using task runners is pretty easy, and once it's set up, *you 
 * never need to think about it again.* Build once, win forever.
 *
 * ## Step 1: Include Gulp and any additional modules required
 *
 * **NOTE:** Don't forget to install the modules:
 *
 *     npm install --save-dev gulp
 *
 * `--save-dev` should be used for any modules only required for development.
 *
 * To install a module that's used throughout the app, use `--save` instead.
 */

// To make things easy, auto-load all gulp modules.
require('matchdep').filterDev('gulp*').forEach(function( module ) {

  // Remove the `gulp-` prefix for better readability.
  var module_name = module.replace(/^gulp-/, '').replace(/-/, '');

  // Then require the module.
  global[module_name] = require(module);

});

// ## Step 2: Create a Style Task
gulp.task('styles', function(  ) {

  // - Target the source SASS files
  gulp.src('./app/public/css/source/**/*.sass')

    // - Check the SASS file for syntax issues
    .pipe(scsslint())

    // - Create a source map for easier development
    .pipe(sourcemaps.init())

    // - Compile SASS files into CSS
    .pipe(sass({ outputStyle: 'compressed', indentedSyntax: true, errLogToConsole: true }))

    // - Use Autoprefixer to add vendor prefixes automatically
    .pipe(autoprefixer())

    // - Rename the processed CSS
    .pipe(concat('all.min.css'))

    // - Write the sourcemap to the output folder
    .pipe(sourcemaps.write('.'))

    // - Save the new CSS file
    .pipe(gulp.dest('./app/public/css/'));

});
