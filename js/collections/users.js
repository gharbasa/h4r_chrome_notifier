

(function () {

  var Users = {};

  Users.model = Models.User;

  Users.url = function () {
    return window.Bkg.settings.apiHost + "/api/1/users?count=0";
  };
  
  Users.initialize = function() {
    this.sort_key = 'fname';
  };
  
  Users.getUserByIdentifier = function(id) {
	  var user = this.find(function(model) {
		  if(Bkg.DEBUG) console.log("Users.getUserByIdentifier, model.get('id')=" + model.get('id') + ", identifier=" + id);
		  if( model.get('id') === id)
			  return model;
	  });
	  return user;
  };
  
  //For sorting the collection
  Users.comparator = function(item) {
    return item.get(this.sort_key);
  };
  
  
  window.Collections = window.Collections || {};
  window.Collections.Users = Backbone.Collection.extend(Users);

}());
