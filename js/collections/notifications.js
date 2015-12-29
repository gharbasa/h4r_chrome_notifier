/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

(function () {

  var Notifications = {};

  Notifications.model = window.Models.Notification;

  Notifications.url = function () {
    //return window.Bkg.settings.apiHost + "/api/1/notifications";
	  console.log("Notifications Url=" + window.Bkg.settings.apiHost + "/api/1/users/ " + Bkg.usersession.getUserId() + "/notifications");
	  return window.Bkg.settings.apiHost + "/api/1/users/ " + Bkg.usersession.getUserId() + "/notifications";
  };

  Notifications.initialize = function () {
    this.on('sync', this.markAsLoaded, this);
    this.on('all', this.updateCounter, this);
  };

  /**
   * Indicate the number of notifications and save last success
   */
  Notifications.markAsLoaded = function () {
    this.last_success_at = +new Date();
    trackEvent("notifications", "Loaded", Bkg.usersession.id, this.length);
  };

  /**
   * Update the notifications count
   */
  Notifications.updateCounter = function () {
    chrome.browserAction.setBadgeText({
      text: (this.models.length === 0 ? "" : "" + this.models.length)
    });
  };
  
  /*For sorting notifications by "updated_at"
   * updated_at format is "2014-08-18 13:10:56 +0000",
   * getDateObj function creates Date javascript object out of string date format.
   * Sorting will be done in descending order, most recent notification appears 1st
   */
  Notifications.comparator = function(item) {
    //var comment = item.last_comment();
    //if(comment) return -1 * getDateObj(comment.updated_at).getTime();
    //else
	console.log("Notification item=" + JSON.stringify(item));
	console.log("Notification item.updated_at=" + item.get("updated_at"));
    return -1 * getDateObj(item.get("updated_at")).getTime();
  };
  
  window.Collections = window.Collections || {};
  window.Collections.Notifications = Backbone.Collection.extend(Notifications);

}());
