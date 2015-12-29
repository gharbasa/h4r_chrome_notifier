
/*global Bkg, chrome
 * If you have to see the console messages from this script
 * 	set Bkg.DEBUG to true in background/init.js file, reload the extension in develper mode from your local file system
 * 	From extensions list page
 * 		Click on the background.html hyperlink from cawm extension
 * 			This will show background related console messages.
 */
 
(function () {

  chrome.browserAction.setBadgeBackgroundColor({
    color: [153, 0, 0, 255]
  });

  /**
   * True if base collections are empty
   */
  function shouldFetchBaseCollections() {
    return Bkg.projects.length + Bkg.users.length + Bkg.task_lists.length > 0;
  }

  /**
   * True if it's time to refresh all base models
   */
  function incrementAndCheckRefreshInterval() {
    Bkg.iterationCounter += 1; //increment by 1
    if(Bkg.iterationCounter === Bkg.CACHE_REFRESH_ITERATION) {
      Bkg.iterationCounter = 0; //fetch happens when its value is 0
    }
    if(Bkg.iterationCounter === 0)
      return true;
    return false;
  }

  function errorClearCache() {
    if(Bkg.DEBUG) console.log("Problem fetching account details, clearing the badge and clear the local cache.");
    chrome.browserAction.setBadgeText({ text: "" });
    Bkg.clearCache();
  }
  
  /*
   * Refresh is only for refreshing Notifications and Base collections, but not refreshing csrf token.
   *   csrf token refresh happens only when you Post new task (or) conversation.
   */
  Bkg.refresh = function (force_refresh) {
    var doFetch = incrementAndCheckRefreshInterval();
    
    if (navigator.onLine && Bkg.isBrowserActive) {
      if (force_refresh || doFetch === true || shouldFetchBaseCollections() === 0) {
        // Fetch base collections, this includes fetching notifications as well
        if(Bkg.DEBUG) console.log("Fetching Base Collection and Notifications");
        Bkg.fetchBaseCollections();
      }
      else {
        //Fetch notifications only.
        if(Bkg.DEBUG) console.log("Fetching Notifications only.");
        chrome.browserAction.setBadgeText({ text: "..." });
        Bkg.notifications.fetch();
      }
    }
  };
  
  //This will fetch Account, Projects, People, Users, Task_Lists and finally notifications.
  Bkg.fetchBaseCollections = function () {
    if(Bkg.DEBUG) console.log("In the beginning of fetchBaseCollections");
    var afterIteration  = 3;
    
    var refreshNotificationsWhenFetched = _.after(afterIteration, function () {
      if(Bkg.DEBUG) console.log("Fetching notifications after base collection fetch is successful.");
      Bkg.notifications.fetch();
    });
    
    chrome.browserAction.setBadgeText({ text: "..." });
    Bkg.usersession.fetch({ success: refreshNotificationsWhenFetched, error: errorClearCache });
    Bkg.users.fetch({ success: refreshNotificationsWhenFetched, error: errorClearCache });
    Bkg.notificationtypes.fetch({ success: refreshNotificationsWhenFetched, error: errorClearCache });
    //Bkg.projects.fetch({ success: refreshNotificationsWhenFetched, error: errorClearCache });
    //Bkg.people.fetch({ success: refreshNotificationsWhenFetched, error: errorClearCache });
    //
    //Bkg.task_lists.fetch({ success: refreshNotificationsWhenFetched, error: errorClearCache });
  };
  
  // Initial data load
  Bkg.refresh();

  // If browser comes up from idleness, trigger immediate refresh
  chrome.idle.onStateChanged.addListener(function (state) {
    if (state === "active") {
      Bkg.refresh();
    }
  });

  // Trigger a refresh check every Bkg.NOTIFICATION_REFRESH_INTERVAL seconds 
  setInterval(Bkg.refresh, Bkg.NOTIFICATION_REFRESH_INTERVAL * 1000);
  
  ////////////////////////////
  
  //detect the platform
  if (navigator.appVersion.indexOf("Win") != -1) Bkg.PLATFORM = Bkg.PLATFORMS[0];
  else if (navigator.appVersion.indexOf("Mac") != -1) Bkg.PLATFORM = Bkg.PLATFORMS[1];
  //else if (navigator.appVersion.indexOf("X11") != -1) Bkg.PLATFORM = "UNIX";
  //else if (navigator.appVersion.indexOf("Linux") != -1) Bkg.PLATFORM = "Linux";
  if(Bkg.DEBUG) console.log("Platform=" + Bkg.PLATFORM);
  
}());
