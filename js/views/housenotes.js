
(function () {

  var HouseNotes = {
    className: "list_housenotes"
  };
  
  HouseNotes.initialize = function () {
    this.collection.on('remove', this.hideHouseNote, this);
  };
  
  /**
   * Show houses or a primer screen, saying they aren't in yet
   */
  HouseNotes.render = function () {
    var self = this;
    if(this.collection == null)
    	return this;
    //window.housenotes_size = this.collection.length;
    this.$el.empty();
    this.collection.each(function (housenote) {
      var view = new Views.HouseNote({ model: housenote });
      self.$el.append(view.render().el);
    });
    this.showPrimerIfEmpty();
    return this;
  };
  
  HouseNotes.focus = function () {
	  this.$("#seach_house").focus();
  };
  
  HouseNotes.showPrimerIfEmpty = function () {
    this.$('.no-housesnotes').remove();

    if (!this.collection.length) {
      this.$el.append(Template('no_housenotes')());
    }
  };

  HouseNotes.hideHouseNote = function (m) {
    // Possible memory leak because we aren't deleting the view?
    this.$("#" + m.get('id')).remove();
    this.showPrimerIfEmpty();
  };
  
  HouseNotes.registerHouseClicked = function (e) {
	  e.preventDefault();
	  Bkg.usersession.trigger("view:edit_house",null);
	  console.log("HouseNotes.registerHouseClicked");
  };
  
  HouseNotes.searchHouseNotesClicked = function (e) {
	  e.preventDefault();
	  console.log("HouseNotes.searchHouseNotesClicked");
  };
  
  HouseNotes.setPopupView = function(popupViewInstance) {
	    this.popupView = popupViewInstance;
  };
	  
  window.Views = window.Views || {};
  window.Views.HouseNotes = Backbone.View.extend(HouseNotes);

}());
