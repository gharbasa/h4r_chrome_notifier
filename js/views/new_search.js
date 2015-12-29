/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

/*global Bkg*/
(function () {
  
  var popupView;
  var NewSearch = {
    
  };

  NewSearch.events = {
    'keyup #search_box_field': 'searchBoxHandleOnContents',
    'click #search-reset': 'searchBoxReset'
  };

  NewSearch.searchBoxHandleOnContents = function (e) {
    e.preventDefault();

    if($("#search_box_field").val().length > 0) {
      $( "#search-reset" ).removeClass('search-icon' );
      $( "#search-reset" ).addClass('search-reset' );
    }
    if (e.keyCode === 13) {
      var searchTextbox = e.currentTarget;
      var search_text = searchTextbox.value;
      this.popupView.searchFromPopupView(search_text);
    }
  };

  NewSearch.searchBoxReset = function () {
    if(this.$('#search-reset').hasClass('search-reset')){
      $( "#search-reset" ).removeClass('search-reset' );
      $( "#search-reset" ).addClass('search-icon' );
      //clear the search box
      $( "#search_box_field" ).val("");
    }
    else {
      $( "#search-reset" ).removeClass('search-icon' );
      $( "#search-reset" ).addClass('search-reset' );
    }
  };
  
  NewSearch.render = function () {
    this.$el.html(Template('new_search')());
    return this;
  };

  NewSearch.setPopupView = function(popupViewInstance) {
    this.popupView = popupViewInstance;
  };
  
  window.Views = window.Views || {};
  window.Views.NewSearch = Backbone.View.extend(NewSearch);

}());
