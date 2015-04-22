/*
 * # The Supercharged Class
 *
 * This class contains methods and properties relating to the app. They're set 
 * up in a way that allows us to quickly and easily call methods without the 
 * need to remember lots of parameters.
 */
(function () {
  'use strict';

  function Supercharged( options ) {

    // - Check for user-supplied options and use an empty object if none exists
    var opts = options || {};

    // - Set debug mode based on config (defaults to `false`)
    this.debug = opts.debug || false;

    // - Get the class name (for debugging)
    var name = this.constructor.name || 'Supercharged';

    // - Chooses a logger
    this.log = typeof bows==='function' ? bows(name) : function(){};

    // - Sets logging according to config options
    localStorage.debug = (this.debug) ? true : '';

    // - Create an initial log message to announce that the class was created
    this.log('New instance created.');

  }

  // Using `Object.create` allows us to easily extend this object later.
  Supercharged.prototype = Object.create({
    constructor: {
      value: Supercharged
    }
  });

  // Expose the Supercharged class is available to the global scope
  window.Supercharged = Supercharged;

}).call();
