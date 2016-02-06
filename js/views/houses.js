
(function () {

  var Houses = {
    className: "houses_list_form"
  };
  
  Houses.events = {
	'click .js-add-house' : 'registerHouseClicked'
   ,'click .js-search-house' : 'searchHousesClicked'
  };
  
  Houses.initialize = function () {
    this.collection.on('remove', this.hideHouse, this);
  };

  /**
   * Show houses or a primer screen, saying they aren't in yet
   */
  Houses.render = function () {
    var self = this;
    this.$el.empty();
    this.$el.html(Template('manage_houses')());
    this.collection.each(function (house) {
      var view = new Views.House({ model: house });
      self.$el.append(view.render().el);
    });

    this.showPrimerIfEmpty();

    return this;
  };

  Houses.focus = function () {
	  this.$("#seach_house").focus();
  };
  
  Houses.showPrimerIfEmpty = function () {
    this.$('.no-houses').remove();

    if (!this.collection.length) {
      this.$el.append(Template('no_houses')());
    }
  };

  Houses.hideHouse = function (m) {
    // Possible memory leak because we aren't deleting the view?
    this.$("#" + m.get('id')).remove();
    this.showPrimerIfEmpty();
  };
  
  Houses.registerHouseClicked = function (e) {
	  e.preventDefault();
	  Bkg.usersession.trigger("view:edit_house",null);
	  console.log("Houses.registerHouseClicked");
  };
  
  Houses.searchHousesClicked = function (e) {
	  e.preventDefault();
	  console.log("Houses.searchHousesClicked");
  };
  
  Houses.setPopupView = function(popupViewInstance) {
	    this.popupView = popupViewInstance;
  };
	  
  window.Views = window.Views || {};
  window.Views.Houses = Backbone.View.extend(Houses);

}());
