/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

(function () {

  var Notification = {};

  Notification.project_url = function () {
    return window.Bkg.settings.apiHost + "#!/projects/" + this.get('target').project_id;
  };

  // Task list URL (if it's a task) or undefined if it isn't
  Notification.task_list_url = function () {
    if (this.get('target').task_list_id) {
      return this.project_url() + '/task_lists/' + this.get('target').task_list_id;
    }
  };
  
  // Builds a CA Work Management backbone URL for the model
  Notification.target_url = function () {
    return this.project_url() + '/' + this.get('target').type.toLowerCase() + "s/" + this.get('target').id;
  };

  // Builds a CA Work Management backbone URL for the model
  Notification.url = function () {
    return window.Bkg.settings.apiHost + '/api/1/notifications/' + this.id;
  };

  // Returns the last comment if this is a thread, or undefined
  Notification.last_comment = function () {
    return ""; //(this.get('target').recent_comments || [])[0];
  };

  // Last user who posted something to this thread or note
  Notification.created_by = function () {
    /*
	  var last_comment = this.last_comment();
    if (last_comment) {
      return Bkg.users.get(last_comment.user_id);
    } else {
    */
    return Bkg.users.get(this.get('created_by'));
    //}
  };
  
  //Last user who posted something to this thread or note
  Notification.user = function () {
    /*
	  var last_comment = this.last_comment();
    if (last_comment) {
      return Bkg.users.get(last_comment.user_id);
    } else {
    */
    return Bkg.users.get(this.get('user_id'));
    //}
  };
  
  Notification.notificationType = function () {
	  return Bkg.notificationtypes.get(this.get('notification_type_id'));
  };
  
  // Returns most recent comment (for threads) or content (for notes)
  Notification.content = function () {
    var target = this.get('target'), comment;

    if (target.type === "Task" || target.type === "Conversation") {
      comment = this.last_comment();
      if (comment) {
        var safeContent = _.escape(comment.body); //xss
        return $("<div class='comment_content'>").html(safeContent);
      }
    } else if (target.type === "Page") {
      var safeContent = escapeTags(target.content);
      return $("<div class='note_content'>").html(safeContent);
    }
  };

  // Persists read state to the server
  Notification.markAsRead = function () {
    $.post(
        Bkg.settings.apiHost + "/api/2/notifications/mark_as_read?targets[]=" + 
        this.get('identifier')
    );
  };

  window.Models = window.Models || {};
  window.Models.Notification = Backbone.Model.extend(Notification);

}());

