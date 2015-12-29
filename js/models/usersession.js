
(function () {

  var UserSession = {};

  UserSession.url = function () {
    return window.Bkg.settings.apiHost + "/api/1/usersession";
  };

  UserSession.fullName = function () {
	//console.log("UserSession.isLoggedIn=" + JSON.stringify(this.get('user'))); - this is good
    return this.get('fname') + ' ' + this.get('lname');
  };

  UserSession.isLoggedIn = function () {
	//console.log("UserSession.isLoggedIn=" + JSON.stringify(Bkg.usersession.get("user")));
	return this.get("id") !== undefined;
  };
  
  UserSession.getUserId = function () {
	    //console.log("UserSession.isLoggedIn=" + JSON.stringify(Bkg.usersession.get("user"))); --this is good
	  return this.get('id');
  };
  
  UserSession.csrf = function () {
	return Bkg.usersession.get('csrf');
  };

  window.Models = window.Models || {};
  window.Models.UserSession = Backbone.Model.extend(UserSession);

}());
