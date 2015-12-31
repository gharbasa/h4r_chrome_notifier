/*
 * Copyright (c) 2014, Gharbasa Inc.  All rights reserved.
*/

/*global Bkg*/
(function () {
  
  var popupView;
  var Userprofilesettings = {
    className: 'userprofilesettings'
  };
  
  Userprofilesettings.events = {
    'click .js-edit-profile' : 'editProfileClicked'
   ,'click .js-logout' : 'logoutClicked'
   ,'click .js-create-profile' : 'createProfileClicked'
  };
  
  /**
   * Render Userprofilesettings 
   */
  Userprofilesettings.render = function () {
    //var target = this.model.get('target') || {};
    this.$el
      //.attr({ 'id': this.model.get('id') })
      .html(Template('userprofilesettings')({
        usersession: Bkg.usersession
      }));
    return this;
  };
  
  /**
   */
  Userprofilesettings.logoutClicked = function (e) {
    //e.preventDefault();
    e.stopPropagation();
    if(Bkg.DEBUG)
      console.log("Userprofilesettings.logoutClicked");
    Bkg.usersession.logout();
  }; 
  
  /**
   */
  Userprofilesettings.editProfileClicked = function (e) {
    e.stopPropagation();
    if(Bkg.DEBUG)
      console.log("Userprofilesettings.editProfileClicked");
    Bkg.usersession.trigger("view:show:edit_user","");
  }; 
  
  Userprofilesettings.createProfileClicked = function (e) {
	  e.stopPropagation();
	  if(Bkg.DEBUG)
	    console.log("Userprofilesettings.createProfileClicked");
	  
  };
  
  Userprofilesettings.setPopupView = function(popupViewInstance) {
    this.popupView = popupViewInstance;
  };
  
  window.Views = window.Views || {};
  window.Views.Userprofilesettings = Backbone.View.extend(Userprofilesettings);

}());
