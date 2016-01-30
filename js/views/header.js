/*
 * Copyright (c) 2014, Gharbasa Inc.  All rights reserved.
*/

/*global Bkg*/
(function () {
  
  var popupView;
  //model here is the User model instance
  var Header = {
    className: 'header'
  };
  
  Header.events = {
    //'click #new_user_submit' : 'editUserClicked'
	//'submit': 'editUserClicked'
    'click .js-hover-user': 'toggleUserProfileView'
   ,'click .icon-home-header':   'hideAllAndShowNotifications'
   ,'click .js-manage-houses': 'toggleManageHousesClick'
  };
  
  Header.initialize = function () {
	  //console.log("EditUser.initialize::this.user= " + JSON.stringify(this.model));  
  };
  
  /**
   * Render EditUser 
   */
  Header.render = function () {
	console.log("Header.render");
	var user = Bkg.usersession.getLoginUser();
	if(user === undefined)
		user = Bkg.usersession;
	
    this.$el
      //.attr({ 'id': this.model.get('id') })
      .html(Template('header')({
    	user:user
      }));
    return this;
  };
  
  Header.toggleUserProfileView = function (e) {
	  this.popupView.toggleUserProfileView(e);
  };
  
  Header.hideAllAndShowNotifications = function (e) {
	  this.popupView.hideAllAndShowNotifications(e);
  };
  
  Header.toggleManageHousesClick = function (e) {
	console.debug("Manage houses clicked");  
	this.popupView.toggleManageHousesView(e);
  };
  
  Header.setPopupView = function(popupViewInstance) {
    this.popupView = popupViewInstance;
  };
  
  window.Views = window.Views || {};
  window.Views.Header = Backbone.View.extend(Header);

}());
