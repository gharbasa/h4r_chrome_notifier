
(function () {

  var User = {};
  
  User.url = function () {
	  if(this.isIdExists())
		  return window.Bkg.settings.apiHost + "/api/1/users" + "/" + this.get("id");
	  else
		  return window.Bkg.settings.apiHost + "/api/1/users";
  };
  
  User.isIdExists = function () {
	  return ((this.get("id") !== undefined) && (this.get("id") !== null));
  };
  
  User.fullName = function () {
    return this.get('fname') + ' ' + this.get('lname');
  };
  
  User.getAvatar = function () {
	  return window.Bkg.settings.apiHost + this.get('avatar');
  };
  
  window.Models = window.Models || {};
  window.Models.User = Backbone.Model.extend(User);

}());
