
/*global Models Collections, Constants and Variables*/
(function () {

  var Bkg = {};
  window.Bkg = Bkg;

  var default_url = localStorage['api_host'];
  if (default_url == undefined) {
    default_url = "http://localhost:3000";
    localStorage.setItem ('api_host', default_url);
  }

  Bkg.settings = {
    apiHost     : default_url
  };

  Bkg.settings.get = function (key) {
    value = localStorage[key];
    return value ? JSON.parse(value) : undefined;
  };

  Bkg.settings.set = function (key, value) {
    localStorage[key] = JSON.stringify(value);
    return value;
  };

  Bkg.usersession = new Models.UserSession();

  Bkg.notifications = new Collections.Notifications();
  Bkg.notificationtypes = new Collections.NotificationTypes();
  Bkg.projects = new Collections.Projects();
  Bkg.people = new Collections.People();
  Bkg.users = new Collections.Users();
  Bkg.houses = new Collections.Houses();
  Bkg.task_lists = new Collections.TaskLists();
  /*
  Bkg.houses.on("add", function(house) {
	  alert("Ahoy " + house.get("name") + "!");
  });
  
  Bkg.users.on("add", function(user) {
	  alert("Ahoy " + user.get("fname") + "!");
  });
  */
  //Following 3 variables are to capture web content from current active tab
  Bkg.tabTitle = "";
  Bkg.tabContent = "";
  Bkg.tabUrl = "";
  Bkg.CHROME_EXTENSION_PAGEURL = "chrome://extensions/";
  Bkg.CHROME_BLANK_TAB = "chrome://newtab/";
  
  //Following variables are to track the popup launch from context menu right click
  Bkg.CONV_CONTEXT_MENU = "conversationMenuItem";
  Bkg.TASK_CONTEXT_MENU = "taskMenuItem";
  Bkg.selectedContextMenuId = "";
  Bkg.fromContextMenu = -1;
  Bkg.popupWindow = null; //holds the reference to the dialog window
  //Following variables are added for watcher support. Watcher/Notify list form is shared by task and conversation form.
  Bkg.LOGIN = "login";
  Bkg.TASK_FORM = "new_task";
  Bkg.USER = "user";
  Bkg.CONV_FORM = "new_conversation";
  Bkg.CREATE_TASK_LABEL = "Create Task";
  Bkg.CREATE_CONV_LABEL = "Create Conversation";
  Bkg.WATCHER_FORM = "watchers";
  Bkg.NOTIFY_ONE_PERSON_LABEL = "1 person";
  Bkg.NOTIFY_PEOPLE_LABEL = "%d people";
  Bkg.NOTIFY_BUTTON_TOOLTIP = "Choose people to notify";
  //Following flag will enable console.log to be displayed in the developer tools console.
  Bkg.DEBUG = true;
  //Following variables are for cache refresh
  Bkg.NOTIFICATION_REFRESH_INTERVAL = 300; //Notifications are refreshed every 5 minutes
  Bkg.CACHE_REFRESH_ITERATION = 2; //(Account, Notifications, Projects, tasks_list, users cache update) . 2 means NOTIFICATION_REFRESH_INTERVAL * 2 = 600 seconds, cache is refreshed for every 10 minutes.
  Bkg.iterationCounter = -1; //Don't change this value. This is increment counter for CACHE_REFRESH_INTERVAL, fetch happens when this counter value is 0
  
  //Following are used in Notifications
  Bkg.status_names = {
    0: "new"    //Removed from product, left it for backward compatibility
  , 1: "not started"  //Not started
  , 2: "blocked"  //blocked
  , 3: "done"  //Renamed from 'Resolved' in Braveheart  
  , 4: "rejected"  //removed from product, left it for backward compatibility
  , 10: "in progress" //Newly introduced in Braveheart release.
  };
  
  Bkg.TASK_STATUS_SYM = {
    NEW: 0    //Removed from product, left it for backward compatibility
  , NOT_STARTED: 1  //Not started
  , BLOCKED: 2  //blocked
  , DONE: 3  //Renamed from 'Resolved' in Braveheart  
  , REJECTED: 4  //removed from product, left it for backward compatibility
  , IN_PROGRESS: 10 //Newly introduced in Braveheart release.
  };

  Bkg.UNKNOWN_USER = "Unknown User";
  Bkg.UNASSIGNED = "Unassigned";
  Bkg.NO_DUE_DATE = "No Due Date";
  Bkg.URGENT = "Urgent";
  Bkg.TRANSITION_SYM = " &rarr; ";
  Bkg.TODAY = "Today";
  Bkg.TOMORROW = "Tomorrow";
  Bkg.YESTERDAY = "Yesterday";
  //If the cache was not refreshed in the next iteration(not 200 ok), empty the cache.
  Bkg.clearCache = function() {
    //Bkg.usersession = new Models.UserSession();
	Bkg.usersession.clear().set({id: null});
    Bkg.notifications.reset();
    Bkg.projects.reset();
    Bkg.people.reset();
    Bkg.users.reset();
    Bkg.task_lists.reset();
    Bkg.iterationCounter = -1; //This will make sure that the cache is re-built in the next iteration.
  };
  
  Bkg.PLATFORMS = ["Windows", "MacOS"];
  Bkg.PLATFORM = Bkg.PLATFORMS[0]; //background.js will detect the platform
  
  //Following state are to track the status of cache refresh. Not used yet.
  Bkg.cacheRefreshStates = {
      NEW: 0    //Plugin just loaded/installed
    , FETCHING: 1  //In the middle of fetch
    , COMPLETED: 2  //Fetch is complete
    , FETCH_ERROR: 3  //Problem fetching, could be server error, http session is invalid.  
  };
  Bkg.currentCacheRefreshState = Bkg.cacheRefreshStates.NEW;
  
}());
