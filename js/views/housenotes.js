
(function () {

  var HouseNotes = {
    className: "list_housenotes"
  };
  
  HouseNotes.events = {
	'submit': 'addHouseNoteClicked'
  };
  
  HouseNotes.initialize = function () {
    this.collection.on('remove', this.hideHouseNote, this);
  };
  
  HouseNotes.addHouseNoteClicked = function (e) {
	  e.preventDefault();
	  var params = this.$('form').serializeObject();
	  params.private = this.$("#private").is(':checked');
	  if(params.note == '') {
	    return;
	  }
	  this.addHouseNote(params);
  };
  
  HouseNotes.addHouseNote = function (params) {
	  $.post(this.collection.url(), params, "json")
		 .done(this.addedNote.bind(this))
	    .fail(this.failedAddingNote.bind(this));
	  
  };
  
  HouseNotes.addedNote = function (response) {
	Bkg.fetchHouseNotes(this.collection.house_id); //This fires an event and notified in popup.js view  
  };
  
  HouseNotes.failedAddingNote = function (response) {
	  console.log("Faile to add note to the house");
  };
  
  /**
   * Show houses or a primer screen, saying they aren't in yet
   */
  HouseNotes.render = function () {
    var self = this;
    
    this.$el.empty();
    
    var house = this.collection.getHouseModel();
    console.debug("house details=" + JSON.stringify(house));
    var houseDetails = {};
    
    if(house == undefined)
    	houseDetails.name = "";
    else {
    	houseDetails.name = house.get("name");
    }
    houseDetails.size = this.collection.length;
    this.$el.html(Template('add_housenote')({model:houseDetails}));
    this.collection.each(function (housenote) {
      var view = new Views.HouseNote({ model: housenote });
      self.$el.append(view.render().el);
    });
    this.showPrimerIfEmpty();
    return this;
  };
  
  HouseNotes.focus = function () {
	  this.$("#note").focus();
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
    
  HouseNotes.setPopupView = function(popupViewInstance) {
	    this.popupView = popupViewInstance;
  };
	  
  window.Views = window.Views || {};
  window.Views.HouseNotes = Backbone.View.extend(HouseNotes);

}());
