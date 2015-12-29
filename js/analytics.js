/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

/**
 * Tracks data once per session (from background) and once per popup opening (from popup)
 *
 * Defines trackEvent(evt, action) to send event data to analytics
 */

var _gaq = _gaq || [];

_gaq.push(['_setAccount', 'UA-49363963-3']);
_gaq.push(['_trackPageview']);

(function() {
//  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
//  ga.src = 'https://ssl.google-analytics.com/ga.js';
//  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

function trackEvent(category, action, opt_label, opt_value) {
//  _gaq.push(['_trackEvent', category, action, opt_label, opt_value]);
}

