
(function () {

  var User = {};
  
  User.url = function () {
	  return window.Bkg.settings.apiHost + "/api/1/users";
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
