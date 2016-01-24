
(function () {

  var UserSession = {};

  UserSession.url = function () {
    return window.Bkg.settings.apiHost + "/api/1/usersession";
  };

  UserSession.fullName = function () {
	//console.log("UserSession.isLoggedIn=" + JSON.stringify(this.get('user'))); - this is good
    return (this.get('fname')?this.get('fname'):"Hello") + ' ' + (this.get('lname')?this.get('lname'):"There");
  };

  UserSession.isLoggedIn = function () {
	//console.log("UserSession.isLoggedIn=" + this.get("id"));
	return ((this.get("id") !== undefined) && (this.get("id") !== null));
  };
  
  UserSession.getUserId = function () {
	    //console.log("UserSession.isLoggedIn=" + JSON.stringify(Bkg.usersession.get("user"))); --this is good
	  return this.get('id');
  };
  
  UserSession.csrf = function () {
	return Bkg.usersession.get('csrf');
  };
  
  UserSession.logout = function () {
	  var me = this;
	  $.ajax({
		  url: Bkg.settings.apiHost + "/api/1/usersession/1", //1 is just place holder
		  type: 'DELETE',
		  success: function(result) {
		        console.log("Logout successful.");
		        me.trigger("usersession:expired","success");
		  },
		  error: function(result) {
		        console.log("Error in logout.");
		        me.trigger("usersession:expired","success");
		  }
		});
  };
  
  UserSession.getLoginUser = function () {
	  return Bkg.users.getUserByIdentifier(this.get("id"));
  };
  
  window.Models = window.Models || {};
  window.Models.UserSession = Backbone.Model.extend(UserSession);

}());
