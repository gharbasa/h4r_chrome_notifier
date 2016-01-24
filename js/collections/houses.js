

(function () {

  var Houses = {};

  Houses.model = Models.House;

  Houses.url = function () {
	var url = window.Bkg.settings.apiHost + "/api/1/houses?count=0";
	if(Bkg.usersession.isLoggedIn())  
		return url + "&user_id=" + Bkg.usersession.getUserId();
	else
		return url;
	console.log("Houses getch Url=" + url);
  };
  
  Houses.initialize = function() {
    this.sort_key = 'name';
  };
  
  //For sorting the collection
  Houses.comparator = function(item) {
    return item.get(this.sort_key);
  };
  
  
  window.Collections = window.Collections || {};
  window.Collections.Houses = Backbone.Collection.extend(Houses);

}());
