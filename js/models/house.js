
(function () {

  var House = {};
  
  House.url = function () {
	  if(this.isIdExists())
		  return window.Bkg.settings.apiHost + "/api/1/houses" + "/" + this.get("id");
	  else
		  return window.Bkg.settings.apiHost + "/api/1/houses";
  };
  
  House.isIdExists = function () {
	  return ((this.get("id") !== undefined) && (this.get("id") !== null));
  };
  
  House.getDisplayDate = function () {
	    var updated_at = this.get('updated_at'); //GMT date in UTC format
	    var localDate = new Date(updated_at);
	    return localDate.toDateString() + " T" + localDate.getHours() +":" + localDate.getMinutes();
  };
  
  House.inactivateUrl = function () {
	  console.log("House.inactivate model " + this.url() + "/inactivate");
	  return this.url() + "/inactivate";
  };
  
  House.activateUrl = function () {
	  console.log("House.activate model");
	  return this.url() + "/activate";
  };
  
  window.Models = window.Models || {};
  window.Models.House = Backbone.Model.extend(House);

}());
