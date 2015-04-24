/*
 * # class.superchargedfacebook.js
 * This class loads a given photo album from Facebook and renders photos with 
 * Mustache templates.
 */
(function () {
  'use strict';

  // ## Create a constructor
  // The constructor for the `SuperchargedFacebook` class sets up config data.
  function SuperchargedFacebook( options ) {

    // - Call the parent class constructor
    Supercharged.apply(this, arguments);

    // - Avoid errors with setting options by ensuring there's an object
    var opts = options || {};

    // - Load the token and album ID from the `options` hash
    this.token = opts.token || false;
    this.albumID = opts.albumID || false;

    // - If the token and/or album ID is missing, don't bother continuing
    if (!this.token || !this.albumID) {
      this.log('A valid token and album ID are required.');
      return false;
    }

    // - Set the URL for the API
    this.api = 'https://graph.facebook.com/v2.3/';

  }

  // Create an object that extends the `Supercharged` class.
  SuperchargedFacebook.prototype = Object.create(Supercharged.prototype, {
    constructor: {
      value: SuperchargedFacebook
    }
  });

  // ## Load user media
  // Create a request for the specified album's photos
  SuperchargedFacebook.prototype.loadRecentMedia = function(  ) {

    var self = this,

        // - Determine the proper API endpoint
        endpoint = self.api + self.albumID + '/photos',

        // - Attach the access token to avoid errors
        url = endpoint + '?access_token=' + self.token;

    // - Use JSONP to load the data and process it with the `handleJSON` method
    self.loadJSONP(url, self.handleJSON.bind(self));

  };

  // ## Handle the JSON response
  SuperchargedFacebook.prototype.handleJSON = function( response ) {

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

        // - Add info about the image to the photos object
        templateVars.photos[count++] = {
          imgSrc: media.picture,
          link: media.link,
          caption: 'Image from Facebook'
        };

      });

      // - Render the output using a Mustache template
      self.renderTemplate(self.template, templateVars, self.addToDOM.bind(self));

    }

  };

  // Make the SuperchargedFacebook class available to the global scope
  window.SuperchargedFacebook = SuperchargedFacebook;

}).call();
