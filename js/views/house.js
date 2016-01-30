
/*global Bkg*/
(function () {

  var House = {
    className: 'house'
  };

  House.events = {
    'click .js-dismiss' : 'dismissHouse'
   ,'click .name' : 'editHouseClick'
   ,'click #addNoteBtn': 'addNoteBtnClick'
   ,'click #inactivateBtn':'inactivateBtnClick'
   ,'click #activateBtn':'activateBtnClick'
  };

  House.initialize = function () {
	  //this.model.on('house:model:updated', this.render, this);
  };

/**
 * Remove from the collection, and mark as read in the server
 */
House.dismissHouse = function (e) {
  e.preventDefault();
  this.model.markAsRead();
  Bkg.houses.remove(this.model);
  //trackEvent("house", "Dismiss");
};

House.addNoteBtnClick = function (e) {
	console.log("addNoteBtnClick");
};

House.inactivateBtnClick = function (e) {
	console.log("inactivateBtnClick");
	var url = this.model.inactivateUrl();
	$.post(url, "", "json")
	 .done(this.updated.bind(this))
    .fail(this.failedUpdating.bind(this));
};

House.updated = function (response) {
	  console.log("Hey, house is updated");
	  this.model.set(response);
	  this.render();
};

House.failedUpdating = function () {
	  console.log("Failed updating house record.");
};


House.activateBtnClick = function (e) {
	console.log("activateBtnClick");
	var url = this.model.activateUrl();
	$.post(url, "", "json")
	 .done(this.updated.bind(this))
    .fail(this.failedUpdating.bind(this));
};

House.editHouseClick = function (e) {
	e.preventDefault();
	Bkg.usersession.trigger("view:edit_house",this.model);
};

  /**
   * Render house
   */
House.render = function () {
	//var target = this.model.get('target') || {};
	this.$el
      .attr({ 'id': this.model.id })
      .html(Template('house')({
        model: this.model
      }));

    // TODO: Show privacy icon

    return this;
};

  window.Views = window.Views || {};
  window.Views.House = Backbone.View.extend(House);

}());
