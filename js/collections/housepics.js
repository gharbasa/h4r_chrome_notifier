
(function () {

  var HousePics = {house_id: -1};
  
  //HousePics.house_id = -1;
  
  HousePics.model = Models.HousePic;

  HousePics.url = function () {
	console.log("HousePics collection house_id=" + this.house_id);
	var url = window.Bkg.settings.apiHost + "/api/1/houses/" + this.house_id + "/house_pics?count=0";
	console.log("HousePics get Url=" + url);
	return url;
  };
  
  HousePics.initialize = function() {
    //this.sort_key = 'updated_at';
  };
  
  //For sorting the collection
  HousePics.comparator = function(item) {
    //return item.get(this.sort_key);
	  return -1 * new Date(item.get("updated_at")).getTime();
  };
  
  HousePics.getHouseModel = function () {
	  var self = this;
	  var house = Bkg.houses.find(function(model) {
		  if( model.get('id') === self.house_id)
			  return model;
	  });
	  return house;
  };
  
  window.Collections = window.Collections || {};
  window.Collections.HousePics = Backbone.Collection.extend(HousePics);

}());
