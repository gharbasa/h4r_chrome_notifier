/*
 * Copyright (c) 2014, Gharbasa Inc.  All rights reserved.
*/

/*global Bkg*/
(function () {
  
  var popupView;
  //model here is the User model instance
  var HouseNote = {
    className: 'house_note'
  };
  
  HouseNote.events = {
    //'click #new_house_submit' : 'editUserClicked'
	'submit': 'HouseNoteClicked'
  };
  
  HouseNote.initialize = function () {
	  //console.log("HouseNote.initialize::this.house= " + JSON.stringify(this.model));  
  };
  
  /**
   * Render HouseNote 
   */
  HouseNote.render = function () {
	if(this.model == undefined)
		this.model = new Models.House();
	console.log("HouseNote.render::this.house= " + JSON.stringify(this.model));
	
	var user = Bkg.usersession.getLoginUser();
	if(user == undefined)
		user = new Models.User();
	
	
    this.$el
      //.attr({ 'id': this.model.get('id') })
      .html(Template('edit_house')({
        user: user
       ,house: this.model
      }));
    return this;
  };
  
  HouseNote.focus = function () {
	 this.$("#name").focus();
  };
  
  /**
   */
  HouseNote.HouseNoteClicked = function (e) {
    e.preventDefault();
    //e.stopPropagation();
    if(Bkg.DEBUG)
      console.log("HouseNote.HouseNoteClicked");
    
    //var createUser = this.isCreateUser();
    var params = this.$('form').serializeObject();
    
    //if(createUser) {
   // 	console.log("Its a create house");
   // 	this.createUser(params);
    //} else {
    	console.log("Its an editing existing house");
    	this.HouseNote(params);
    //}
  }; 
  
  HouseNote.HouseNote = function (params) {
	  //console.log("Edit House view. HouseNote function." + );
	  params.verified = this.$("#verified").is(':checked');
	  var isCreate = true;
	  if(this.model.isIdExists()) {
		  params.id = this.model.get("id");
		  isCreate = false;
	  }
	  var me = this;
	  this.model.save(params,
			  {
		  		success: function (model, response) {
		  			var msg = "";
		  			if(isCreate) {
		  				msg = "success, creating the house " + JSON.stringify(me.model);
		  				Bkg.houses.add(response);
		  			}
		  			else
		  				msg = "success, updating the house";
		  			
		  			console.log(msg);
		  			//this.$('.errors').show().text(msg);
		  			if(isCreate)
		  				Bkg.usersession.trigger("view:create_house1:success","");
		  			else
		  				Bkg.usersession.trigger("view:update_house1:success","");
		  		},
		  		error: function (model, response) {
		  			if(isCreate) {
		  				console.log("error creating the house=" + JSON.stringify(response));
		  			}
		  			else {
		  				console.log("error Updating the house=" + JSON.stringify(response));
		  			}
		  			var responseText = JSON.parse(response.responseText);
		  			var errorMsg = "";
		  			if(responseText.errorMessage)
		  				errorMsg = responseText.errorMessage[0];
		  			else
		  				errorMsg = response.statusText;
		  			this.$('.errors').show().text(errorMsg);
		  		}
			  }
	  );
  };
  
  HouseNote.setPopupView = function(popupViewInstance) {
    this.popupView = popupViewInstance;
  };
  
  window.Views = window.Views || {};
  window.Views.HouseNote = Backbone.View.extend(HouseNote);

}());
