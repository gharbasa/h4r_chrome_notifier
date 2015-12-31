/*
 * Copyright (c) 2014, Gharbasa Inc.  All rights reserved.
*/

/*global Bkg*/
(function () {
  
  var popupView;
  var EditUser = {
    className: 'edit_user'
  };
  
  EditUser.events = {
    'click #new_user_submit' : 'editUserClicked'
   ,'click #new_user_submit' : 'editUserClicked'
  };
  
  EditUser.initialize = function () {
	  console.log("EditUser.initialize::this.usersession= " + JSON.stringify(this.usersession));  
  };
  
  /**
   * Render EditUser 
   */
  EditUser.render = function () {
    //var target = this.model.get('target') || {};
	console.log("EditUser.render::this.usersession= " + JSON.stringify(this.usersession));
    this.$el
      //.attr({ 'id': this.model.get('id') })
      .html(Template('edit_user')({
        usersession: Bkg.usersession
      }));
    return this;
  };
  
  /**
   */
  EditUser.editUserClicked = function (e) {
    //e.preventDefault();
    e.stopPropagation();
    if(Bkg.DEBUG)
      console.log("EditUser.editUserClicked");
  }; 
  
  EditUser.setPopupView = function(popupViewInstance) {
    this.popupView = popupViewInstance;
  };
  
  window.Views = window.Views || {};
  window.Views.EditUser = Backbone.View.extend(EditUser);

}());
