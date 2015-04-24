// # class.superchargedinstagram.js

// This class loads a given user's recent Instagram posts and displays them on 
// the page using Mustache templates.

(function () {
  'use strict';

  // ## Create a constructor

  // The constructor for the `SuperchargedInstagram` class sets up config data.
  function SuperchargedInstagram( options ) {

    // - Call the parent class constructor
    Supercharged.apply(this, arguments);

    // - Avoid errors with setting options by ensuring there's an object
    var opts = options || {};

    // - Load the token and user ID from the `options` hash
    this.token = opts.token || false;
    this.userID = opts.userID || false;

    // - If the token and/or user ID is missing, don't bother continuing
    if (!this.token || !this.userID) {
      this.log('A valid token and user ID are required.');
      return false;
    }

    // - Set the URL for the API
    this.igAPI = 'https://api.instagram.com/v1/';

  }

  // Create an object that extends the `Supercharged` class.
  SuperchargedInstagram.prototype = Object.create(Supercharged.prototype, {
    constructor: {
      value: SuperchargedInstagram
    }
  });

  // ## Load user media

  // Create a request for the specified user's photos
  SuperchargedInstagram.prototype.loadRecentMedia = function(  ) {

    var self = this,

        // - Determine the proper API endpoint
        endpoint = self.igAPI + 'users/' + self.userID + '/media/recent',

        // - Attach the access token to avoid errors
        url = endpoint + '?access_token=' + self.token;

    // - Use JSONP to load the data and process it with the `handleJSON` method
    self.loadJSONP(url, self.handleJSON.bind(self));

  };

  // ## Handle the JSON response

  // Parse the returned JSON in a format usable by our template.
  SuperchargedInstagram.prototype.handleJSON = function( response ) {

    // - Make the `this` accessible inside the `forEach` loop
    var self = this,
        templateVars = {},
        count = 0;

    self.log('Data received:', response);

    // - Make sure the response contains valid data
    if (response.hasOwnProperty('data') && response.data.length>0) {

      // - Create an empty object to store photos
      templateVars.photos = [];

      // - Loop through each item in the returned media
      response.data.forEach(function( media, index ) {

        if (count>=self.photosToDisplay) {
          return;
        }

        // - For now, only images are supported
        if (media.type==='image') {

          // - Add info about the image to the photos object
          templateVars.photos[count++] = {
            imgSrc: media.images.low_resolution.url,
            link: media.link,
            caption: media.caption.text
          };

        }

      });

      // - Render the output using a Mustache template
      self.log(templateVars);
      self.renderTemplate(self.template, templateVars, self.addToDOM.bind(self));

    }

  };

  // Make the SuperchargedInstagram class available to the global scope
  window.SuperchargedInstagram = SuperchargedInstagram;

}).call();
