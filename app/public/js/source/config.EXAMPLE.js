// # config.js

// This file sets up config data for use within the app.

(function(  ) {
  'use strict';

  window.APP_CONFIG = {
    instagram: {

      // - [Find your user ID](http://jelled.com/instagram/lookup-user-id)
      userID: 'YOUR_IG_USER_ID_HERE',

      // - [Get a token](https://instagram.com/developer/api-console/)
      token: 'YOUR_IG_TOKEN_HERE'

    },
    facebook: {

      // - [Find an album ID](http://bit.ly/1yTm0RI)
      albumID: 'YOUR_FB_ALBUM_ID_HERE',

      // - [Get a token](http://bit.ly/1DgCkqZ)
      token: 'YOUR_FB_TOKEN_HERE'

    }
  };

})();
