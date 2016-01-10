
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
	  return (this.get('fname')?this.get('fname'):"Hello") + ' ' + (this.get('lname')?this.get('lname'):"There");
  };
	/*  
  User.fullName = function () {
    return this.get('fname') + ' ' + this.get('lname');
  };
  */
  User.getAvatar = function () {
	  //console.log("Avatar:" + window.Bkg.settings.apiHost + this.get('avatar'));
	  return window.Bkg.settings.apiHost + this.get('avatar');
  };
  
  window.Models = window.Models || {};
  window.Models.User = Backbone.Model.extend(User);

}());
