
(function () {

  var NotificationTypes = {};

  NotificationTypes.model = window.Models.NotificationType;

  NotificationTypes.url = function () {
    return window.Bkg.settings.apiHost + "/api/1/notification_types";
  };

  NotificationTypes.initialize = function () {
    //this.on('sync', this.markAsLoaded, this);
    //this.on('all', this.updateCounter, this);
  };
  
  NotificationTypes.comparator = function(item) {
    console.log("NotificationType item=" + JSON.stringify(item));
	return -1 * item.id;
  };

  window.Collections = window.Collections || {};
  window.Collections.NotificationTypes = Backbone.Collection.extend(NotificationTypes);

}());
