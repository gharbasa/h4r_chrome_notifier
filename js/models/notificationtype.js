
(function () {

  var NotificationType = {};

  NotificationType.subject = function () {
	    return this.get('subject');
  };
  
  NotificationType.content = function () {
	    return this.get('content');
  };

  window.Models = window.Models || {};
  window.Models.NotificationType = Backbone.Model.extend(NotificationType);

}());