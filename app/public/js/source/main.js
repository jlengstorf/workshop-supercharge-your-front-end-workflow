/*
 * # main.js
 * This script initializes all functionality for the app.
 */
(function(  ) {
  'use strict';

  // - Load config variables
  var config = window.APP_CONFIG;

  // ## Set up the Instagram photo loader
  // - Create config options for the Supercharged class
  var ig_config = {
    debug: true,
    userID: config.instagram.userID,
    token: config.instagram.token,
    container: '.photo-viewer--instagram',
    template: '/partials/instagram.mustache'
  };

  // - Create a new instance of the SuperchargedInstagram class
  var instagram = new SuperchargedInstagram(ig_config);

  // - Load recent photos from Instagram
  instagram.loadRecentMedia();


  // ## Set up the Facebook album loader
  // - Create config options for the SuperchargedFacebook class
  var fb_config = {
    debug: true,
    albumID: config.facebook.albumID,
    token: config.facebook.token,
    container: '.photo-viewer--facebook',
    template: '/partials/facebook.mustache',
    // - Limit the number of photos to display
    photosToDisplay: 8

  };

  // - Create a new instance of the SuperchargedFacebook class
  var facebook = new SuperchargedFacebook(fb_config);

  // - Load photos from the Facebook Album
  facebook.loadRecentMedia();

}).call();
