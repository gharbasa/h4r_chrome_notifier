
(function () {

  var HouseNote = {};
  
  HouseNote.url = function () {
	  if(this.isIdExists())
		  return window.Bkg.settings.apiHost + "/api/1/houses/" + this.get("house_id") + "/notes/" + this.get("id");
	  else
		  return window.Bkg.settings.apiHost + "/api/1/houses/{id}/notes";
  };
  
  HouseNote.isIdExists = function () {
	  return ((this.get("id") !== undefined) && (this.get("id") !== null));
  };
  
  HouseNote.getDisplayDate = function () {
	    var updated_at = this.get('updated_at'); //GMT date in UTC format
	    var localDate = new Date(updated_at);
	    return localDate.toDateString() + " T" + localDate.getHours() +":" + localDate.getMinutes();
  };
  
  HouseNote.dismissUrl = function () {
	  console.log("HouseNote.inactivate model " + this.url());
	  return this.url();
  };
  
  window.Models = window.Models || {};
  window.Models.HouseNote = Backbone.Model.extend(HouseNote);

}());
