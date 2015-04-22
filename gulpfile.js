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

// For easy reference, declare all filepaths in one place.
var paths = {
  styles: {
    src: './app/public/css/source/main.sass',
    dest: './app/public/css/',
    watch: './app/public/css/source/**/*.sass' // Better LiveReload support.
  },
  scripts: {
    src: './app/public/js/source/**/*.js',
    dest: './app/public/js/'
  },
  bower_dependencies: {
    src: './app/server/views/layouts/default.jade',
    dest: './app/server/views/layouts'
  }
};

// To make things easy, auto-load all gulp modules.
require('matchdep').filterDev('gulp*').forEach(function( module ) {

  // Remove the `gulp-` prefix & internal hyphens for better module var names.
  var module_name = module.replace(/^gulp-/, '').replace(/-/, '');

  // Then require the module.
  global[module_name] = require(module);

});

// ## Step 2: Create a Style Task
gulp.task('styles', function(  ) {

  // - Target the source SASS files
  gulp.src(paths.styles.src)

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
    .pipe(gulp.dest(paths.styles.dest))

    // - Reload the browser
    .pipe(livereload());

});

// ## Step 3: Create a Script Task
gulp.task('scripts', function(  ) {

  // For better JSHint output, we're going to use `jshint-stylish`.
  var stylish = require('jshint-stylish');

  // - Target the source JS files
  gulp.src(paths.scripts.src)

    // - Check the JS for syntax issues
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))

    // - Create a source map for easier development
    .pipe(sourcemaps.init())

    // - Concatenate all scripts into one file
    .pipe(concat('all.min.js'))

    // - Compress the output for smaller file size
    .pipe(uglify())

    // - Write the sourcemap to the output folder
    .pipe(sourcemaps.write('.'))

    // - Save the new JS file
    .pipe(gulp.dest(paths.scripts.dest))

    // - Reload the browser
    .pipe(livereload());

});

// ## Step 4: Automatically inject Bower dependencies using `wiredep`
gulp.task('bower_dependencies', function(  ) {

  // - Use the `stream` support wiredep offers
  var wiredep = require('wiredep').stream;

  // - Target which file(s) need to have dependencies included
  gulp.src(paths.bower_dependencies.src)

    // - Wire all Bower dependencies into the source files
    .pipe(wiredep({ devDependencies: true, ignorePath: '../../../public' }))

    // - Save the file in the destination directory
    .pipe(gulp.dest(paths.bower_dependencies.dest))

    // - Reload the browser
    .pipe(livereload());

});

// ## Step 5: Watch files for changes to automatically update them
gulp.task('watch', ['serve'], function(  ) {

  // - Start listening on the LiveReload port
  livereload.listen();

  // - Set up a watcher on files to execute the proper tasks
  gulp.watch(paths.styles.watch, ['styles']);
  gulp.watch(paths.scripts.src, ['scripts']);

});

// ## Step 6: Create a server
gulp.task('serve', function(  ) {

  // Nodemon makes it extremely simple to run a dev server locally
  nodemon({ script: './app/index.js' });

});

// ## Step 7: Create a default task
// Each of the tasks created above will now execute at once by running `gulp`
gulp.task('default', ['watch']);
