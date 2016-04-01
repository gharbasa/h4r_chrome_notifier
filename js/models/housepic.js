
(function () {

  var HousePic = {};
  
  HousePic.url = function () {
	  if(this.isIdExists())
		  return window.Bkg.settings.apiHost + "/api/1/houses/" + this.get("house_id") + "/house_pics/" + this.get("id");
	  else
		  return window.Bkg.settings.apiHost + "/api/1/houses/{id}/house_pics";
  };
  
  HousePic.isIdExists = function () {
	  return ((this.get("id") !== undefined) && (this.get("id") !== null));
  };
  
  HousePic.getDisplayDate = function () {
	    var updated_at = this.get('updated_at'); //GMT date in UTC format
	    var localDate = new Date(updated_at);
	    return localDate.toDateString() + " T" + localDate.getHours() +":" + localDate.getMinutes();
  };
  
  HousePic.dismissUrl = function () {
	  console.log("HousePic.inactivate model " + this.url());
	  return this.url();
  };
  
  window.Models = window.Models || {};
  window.Models.HousePic = Backbone.Model.extend(HousePic);

}());
