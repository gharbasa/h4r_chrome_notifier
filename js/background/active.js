/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

/**
 * Expose Bkg.isBrowserActive, which is true if it's been active during the
 * last five minutes (moving mouse, etc).
 *
 * This is a Chrome API that interfaces with the operating system.
 */

(function () {

  var period = 60 * 5;

  Bkg.isBrowserActive = true;

  // Check if user has been active for the last minute
  function isActive() {
    chrome.idle.queryState(period, function (state) {
      Bkg.isBrowserActive = (state === "active");
    });
  }

  setInterval(isActive, period * 1000);

}());
