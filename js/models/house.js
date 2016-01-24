
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
  
  House.fullName = function () {
	  return (this.get('fname')?this.get('fname'):"Hello") + ' ' + (this.get('lname')?this.get('lname'):"There");
  };
  
  House.admin = function () {
	 return this.get("admin?");
  };
  
  House.getAvatar = function () {
	  //console.log("Avatar:" + window.Bkg.settings.apiHost + this.get('avatar'));
	  return window.Bkg.settings.apiHost + this.get('avatar');
  };
  
  House.getDisplayDate = function () {
	    var updated_at = this.get('updated_at'); //GMT date in UTC format
	    var localDate = new Date(updated_at);
	    return localDate.toDateString() + " T" + localDate.getHours() +":" + localDate.getMinutes();
  };
	  
  window.Models = window.Models || {};
  window.Models.House = Backbone.Model.extend(House);

}());
