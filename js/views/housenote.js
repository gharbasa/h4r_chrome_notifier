
/*global Bkg*/
(function () {

  var HouseNote = {
    className: 'housenote'
  };

  HouseNote.events = {
    'click .js-dismiss' : 'dismissHouseNote'
  };

  HouseNote.initialize = function () {
	  //this.model.on('house:model:updated', this.render, this);
  };

/**
 * Remove from the collection, and mark as read in the server
 */
  HouseNote.dismissHouseNote = function (e) {
    e.preventDefault();
    var url = this.model.dismissUrl();
    $.ajax({
        url: url,
        type: 'DELETE',
        success: this.updated.bind(this),
        fail: this.failedUpdating.bind(this) 
    });
  };
  
  HouseNote.updated = function (response) {
    console.log("Hey, housenote is removed");
    Bkg.housenotes.remove(this.model);
  };

  HouseNote.failedUpdating = function () {
    console.log("Failed dismissing housenote record.");
  };

  /**
   * Render house
   */
  HouseNote.render = function () {
	//var target = this.model.get('target') || {};
	console.log("Inside HouseNote.render()...");
	var className = "housenote active";
	if(!this.model.get("active"))
		className = "house inactive";
	
	this.$el
      .attr({ 'id': this.model.id, class: className })
      .html(Template('housenote')({
        model: this.model
      }));

    // TODO: Show privacy icon

    return this;
  };

  window.Views = window.Views || {};
  window.Views.HouseNote = Backbone.View.extend(HouseNote);

}());
