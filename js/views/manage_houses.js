/*
 * Copyright (c) 2014, Gharbasa Inc.  All rights reserved.
*/

/*global Bkg*/
(function () {
  
  var popupView;
  var ManageHouses = {
    className: 'managehouses'
  };
  //model here is usersession
  ManageHouses.events = {
    'click .js-register-property' : 'registerHouseClicked'
   ,'click .js-list-properties' : 'listHousesClicked'
  };
  
  /**
   * Render ManageHouses 
   */
  ManageHouses.render = function () {
    //var target = this.model.get('target') || {};
    this.$el
      //.attr({ 'id': this.model.get('id') })
      .html(Template('manage_houses')({
        usersession: this.model
      }));
    return this;
  };
  
  /**
   */
  ManageHouses.registerHouseClicked = function (e) {
    //e.preventDefault();
    e.stopPropagation();
    if(Bkg.DEBUG)
      console.log("ManageHouses.registerHouseClicked");
    this.popupView.showRegisterHouseForm();
  }; 
  
  /**
   */
  ManageHouses.listHousesClicked = function (e) {
    e.stopPropagation();
    if(Bkg.DEBUG)
      console.log("ManageHouses.listHousesClicked");
    this.popupView.showHouseList();
  }; 
  
  ManageHouses.setPopupView = function(popupViewInstance) {
    this.popupView = popupViewInstance;
  };
  
  window.Views = window.Views || {};
  window.Views.ManageHouses = Backbone.View.extend(ManageHouses);

}());
