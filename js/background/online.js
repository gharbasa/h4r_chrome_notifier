/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

/**
 * Handle going online and offline
 */

(function () {

  function setOnlineMode() {
    if (navigator.onLine) {
      chrome.browserAction.setIcon({path: {'19': 'images/logo_19.png', '38': 'images/logo_38.png'}});
      if(Bkg.DEBUG) console.log("Browser is online, force refresh cache.");      
      Bkg.refresh(true); //force refresh cache.
    } else {
      chrome.browserAction.setIcon({path: {'19': 'icons/19_inactive.png', '38': 'icons/38_inactive.png'}});
      if(Bkg.DEBUG) console.log("Browser is offline. Do nothing.");
    }
  };

  $(window).bind('offline', setOnlineMode);
  $(window).bind('online', setOnlineMode);

}());
