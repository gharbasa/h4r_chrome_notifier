

(function () {

  var Users = {};

  Users.model = Models.User;

  Users.url = function () {
    return window.Bkg.settings.apiHost + "/api/1/users?count=0";
  };
  
  Users.initialize = function() {
    this.sort_key = 'fname';
  };
  
  //For sorting the collection
  Users.comparator = function(item) {
    return item.get(this.sort_key);
  };

  window.Collections = window.Collections || {};
  window.Collections.Users = Backbone.Collection.extend(Users);

}());
