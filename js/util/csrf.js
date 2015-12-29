/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

/*
  * Inject csrf token in the request. Following code is picked from 
  * frontend app repo /app/javascripts/intializers/csrf.js
*/

/**
   * In particular, the convention has been established that the GET and HEAD
   * methods SHOULD NOT have the significance of taking an action other than
   * retrieval. These methods ought to be considered "safe". This allows user
   * agents to represent other methods, such as POST, PUT and DELETE, in a
   * special way, so that the user is made aware of the fact that a possibly
   * unsafe action is being requested.
   */
  function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
  }
    
  $.ajaxSetup({
    crossDomain: false, // obviates need for sameOrigin test
    beforeSend: function (xhr, settings) {
      var csrftoken = Bkg.usersession.csrf();
      if (csrftoken && !csrfSafeMethod(settings.type)) {
      	if(Bkg.DEBUG) console.log("Adding CSRF Token=" + Bkg.account.csrf() + " to the post request.");
        xhr.setRequestHeader("X-CSRFToken", csrftoken);
      }
    }
  });