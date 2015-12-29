/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

/*global Bkg*/
(function () {
  
  var popupView;
  var User = {
    className: 'watcher'
  };
  
  User.events = {
    'click input[type=checkbox]' : 'watcherCheckboxClicked'
  };
  
  /**
   * Render user model
   */
  User.render = function () {
    var target = this.model.get('target') || {};
    this.$el
      .attr({ 'id': this.model.get('id') })
      .html(Template('user')({
        user: this.model,
        account: Bkg.account
      }));
    return this;
  };
  
  /**
   * If checkbox is 
   * 	checked
   * 		Include the selected user in watchers list
   *    unchecked
   *        Exclude the selected user from watchers list
   */
  User.watcherCheckboxClicked = function (e) {
    //e.preventDefault();
    e.stopPropagation();
    if(Bkg.DEBUG)
      console.log("watcherCheckboxClicked");
    var checkboxObj = e.currentTarget;
    var userId = checkboxObj.getAttribute("userid");
    if(isMe(userId)) {
      e.preventDefault();
      return; //Do nothing if the user is a login user.
    }
  }; 
  
  User.setPopupView = function(popupViewInstance) {
    this.popupView = popupViewInstance;
  };
  
  window.Views = window.Views || {};
  window.Views.User = Backbone.View.extend(User);

}());
