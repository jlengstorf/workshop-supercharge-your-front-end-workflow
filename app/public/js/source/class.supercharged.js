/*
 * # class.supercharged.js
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

    // - Get the container from the options (default `false` to fail gracefully)
    this.container = opts.container || false;

    // - Set the number of photos to be displayed
    this.photosToDisplay = opts.photosToDisplay || 10;

    // - Set the location of the template for displaying output
    this.template = opts.template || false;

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

  // Loads a URL via AJAX
  Supercharged.prototype.loadURL = function( url, successCB, errorCB, loadJSON ) {

    // - Set up an `XMLHttpRequest` object (Look Ma! No jQuery!)
    var self=this,
        request = new XMLHttpRequest(),
        success = typeof successCB==='function' ? successCB : function(){},
        error = typeof errorCB==='function' ? errorCB : function(){};
    
    // - Make sure the `loadJSON` argument is boolean
    loadJSON = loadJSON===false ? false : true;

    // - Open the request to load the URL
    request.open('GET', url, true);

    // - Set a handler for when the request is loaded
    request.onload = function(  ) {

      // - Check for a valid response code
      if (request.status>=200 && request.status<400) {

        // - Check if the response is expected to be JSON
        var response = '';
        if (!!loadJSON) {
          response = JSON.parse(request.responseText);
        } else {
          response = request.responseText;
        }

        // - Fire the success callback
        success(response);

      } else {

        // - If the request status is wrong, fire the error callback
        error(request);

      }

    };

    // - If the request throws an error, fire the error callback
    request.onerror = function(  ) {
      error(request);
    };

    // - Actually send the request
    request.send();

  };

  // For sites without CORS headers, we use JSONP as a workaround
  Supercharged.prototype.loadJSONP = function( url, successCB ) {

    // - Create a unique callback function to handle the response
    //   - Create an empty array with one element
    var random = new Uint32Array(1);

    //   - Generate a random value and fill the new array
    window.crypto.getRandomValues(random);

    //   - Generate a unique name for the callback using the random value
    var cbName = 'cb' + random[0];

    //   - Create a function to act as the the JSONP callback
    window[cbName] = function( data ) {
      if (typeof successCB==='function') {
        successCB(data);
      }
    };

    // - Create a script and load the URL with a reference to our callback
    var jsonp = document.createElement('script');
    jsonp.src = url + '&callback=' + cbName;
    document.head.appendChild(jsonp);

  };

  // Load a Mustache template and process it with template variables
  Supercharged.prototype.renderTemplate = function( template, templateVars, callback ) {
    var self = this,
        cb = typeof callback==='function' ? callback : function(){},
        success = function(template) {

          // - After successfully loading the template, render it with Mustache
          var markup = Mustache.render(template, templateVars);

          // - Call the given callback function to do something with the markup
          cb(markup);

        };

    // - Make sure the template is set
    if (!!template) {

      // - Load the template and specify success and failure callbacks
      //   - Templates should not be loaded as JSON, so set `loadJSON` to `false` 
      this.loadURL(template, success, this.handleError, false);

    } else {

      // - Log a message if no template is specified
      this.log('No template specified.');

    }

  };

  // Add the rendered template markup to the DOM inside a specified element
  Supercharged.prototype.addToDOM = function( markup ) {

    // - Select the container 
    var container = document.querySelector(this.container);

    // - Ensure the container exists
    if (container) {

      // - Replace its contents with the new markup
      container.innerHTML = markup;

    } else {

      // - Log a message if the container is invalid
      this.log('Please specify a valid container.');

    }

  };

  // Handle application errors
  Supercharged.prototype.handleError = function( error ) {

    // - For lack of better error handling, simply log errors for now
    this.log(error);

  };

  // Make the Supercharged class available in the global scope
  window.Supercharged = Supercharged;

}).call();
