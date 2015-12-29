/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

(function () {

  var popupView;
  var launchFrom; //This will track which view launched this users collection.
  var Users = {};
  
  Users.initialize = function () {
    //this.collection.on('remove', this.hideNotification, this);
  };

  /**
   * Show notifications or a primer screen, saying they aren't in yet
   */
  Users.render = function (project_id) {
    var self = this;
    var popupView = this.popupView;
    //Here we have to render the people from the selected project, not all the users.
    if(Bkg.DEBUG)
      console.log("Users.render::selected project_id=" + project_id);
    if(project_id != null && project_id != "")
    {
      var people = Bkg.people.forProject(project_id); 	
      self.$el.html(Template('watcher_header')());
      
      var sortedProjectUsers = sortProjectPeople(people);

      //Add sorted user's collection to view.      
      sortedProjectUsers.each(function (user) {
        var userView = new Views.User({ model: user });
        userView.setPopupView(popupView);
        self.$el.append(userView.render().el);
      });
    }
    return self;
  };

  Users.setPopupView = function(popupViewInstance) {
    this.popupView = popupViewInstance;
  };
  
  window.Views = window.Views || {};
  window.Views.Users = Backbone.View.extend(Users);

}());
