/*
 * Copyright (c) 2014, Gharbasa Inc.  All rights reserved.
*/

/*global Bkg*/
(function () {
  
  var popupView;
  var Userprofilesettings = {
    className: 'userprofilesettings'
  };
  //model here is usersession
  Userprofilesettings.events = {
    'click .js-edit-profile' : 'editProfileClicked'
   ,'click .js-logout' : 'logoutClicked'
   ,'click .js-create-profile' : 'createProfileClicked'
   ,'click .js-update-avatar' : 'updateAvatar'
  };
  
  /**
   * Render Userprofilesettings 
   */
  Userprofilesettings.render = function () {
    //var target = this.model.get('target') || {};
    this.$el
      //.attr({ 'id': this.model.get('id') })
      .html(Template('userprofilesettings')({
        usersession: this.model,
        user: this.model.getLoginUser()
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
    this.model.logout();
  }; 
  
  /**
   */
  Userprofilesettings.editProfileClicked = function (e) {
    e.stopPropagation();
    if(Bkg.DEBUG)
      console.log("Userprofilesettings.editProfileClicked");
    this.model.trigger("view:show:edit_user","");
  }; 
  
  Userprofilesettings.createProfileClicked = function (e) {
	  e.stopPropagation();
	  if(Bkg.DEBUG)
	    console.log("Userprofilesettings.createProfileClicked");
	  this.model.trigger("view:show:create_user","");
  };
  
  Userprofilesettings.updateAvatar = function (e) {
	  e.stopPropagation();
	  if(Bkg.DEBUG)
	    console.log("Userprofilesettings.updateAvatar");
	  this.model.trigger("view:show:update_avatar","");
  };
  
  Userprofilesettings.setPopupView = function(popupViewInstance) {
    this.popupView = popupViewInstance;
  };
  
  window.Views = window.Views || {};
  window.Views.Userprofilesettings = Backbone.View.extend(Userprofilesettings);

}());
