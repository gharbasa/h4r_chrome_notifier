
(function () {

  var HouseNotes = {house_id: -1};
  
  //HouseNotes.house_id = -1;
  
  HouseNotes.model = Models.HouseNote;

  HouseNotes.url = function () {
	console.log("HouseNotes collection house_id=" + this.house_id);
	var url = window.Bkg.settings.apiHost + "/api/1/houses/" + this.house_id + "/notes?count=0";
	console.log("HouseNotes get Url=" + url);
	return url;
  };
  
  HouseNotes.initialize = function() {
    //this.sort_key = 'updated_at';
  };
  
  //For sorting the collection
  HouseNotes.comparator = function(item) {
    //return item.get(this.sort_key);
	  return -1 * new Date(item.get("updated_at")).getTime();
  };
  
  HouseNotes.getHouseModel = function () {
	  var self = this;
	  var house = Bkg.houses.find(function(model) {
		  if( model.get('id') === self.house_id)
			  return model;
	  });
	  return house;
  };
  
  window.Collections = window.Collections || {};
  window.Collections.HouseNotes = Backbone.Collection.extend(HouseNotes);

}());
