/*
 * Copyright (c) 2014, Gharbasa Inc.  All rights reserved.
*/

/*global Bkg*/
(function () {
  
  var popupView;
  //model here is the User model instance
  var EditUser = {
    className: 'edit_user'
  };
  
  EditUser.events = {
    //'click #new_user_submit' : 'editUserClicked'
	'submit': 'editUserClicked'
  };
  
  EditUser.initialize = function () {
	  //console.log("EditUser.initialize::this.user= " + JSON.stringify(this.model));  
  };
  
  EditUser.focus = function () {
	  //console.log("EditUser.initialize::this.user= " + JSON.stringify(this.model));
	  this.$("#fname").focus();
  };
  
  /**
   * Render EditUser 
   */
  EditUser.render = function () {
    //var target = this.model.get('target') || {};
	console.log("EditUser.render::this.user= " + this.model.fullName());
    this.$el
      //.attr({ 'id': this.model.get('id') })
      .html(Template('edit_user')({
        user: this.model
      }));
    return this;
  };
  
  /**
   */
  EditUser.editUserClicked = function (e) {
    e.preventDefault();
    //e.stopPropagation();
    if(Bkg.DEBUG)
      console.log("EditUser.editUserClicked");
    
    //var createUser = this.isCreateUser();
    var params = this.$('form').serializeObject();
    
    //if(createUser) {
   // 	console.log("Its a create user");
   // 	this.createUser(params);
    //} else {
    	console.log("Its an editing existing user");
    	this.editUser(params);
    //}
  }; 
  
  EditUser.editUser = function (params) {
	  console.log("Edit User view. editUser function.");
	  params.verified = this.$("#verified").is(':checked');
	  //var user = new Models.User(params);
	  //user.save(null,
	  var isCreate = true;
	  if(this.model.isIdExists()) {
		  params.id = this.model.get("id");
		  isCreate = false;
	  }
	  this.model.save(params,
			  {
		  		success: function (model, response) {
		  			var msg = "";
		  			if(isCreate) {
		  				msg = "success, creating the user";
		  				Bkg.users.add(response);
		  			}
		  			else
		  				msg = "success, updating the user";
		  			
		  			console.log(msg);
		  			//this.$('.errors').show().text(msg);
		  			if(isCreate)
		  				Bkg.usersession.trigger("view:create_user:success","");
		  			else
		  				Bkg.usersession.trigger("view:update_user:success","");
		  		},
		  		error: function (model, response) {
		  			if(isCreate) {
		  				console.log("error creating the user=" + JSON.stringify(response));
		  			}
		  			else {
		  				console.log("error Updating the user=" + JSON.stringify(response));
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
  
  EditUser.setPopupView = function(popupViewInstance) {
    this.popupView = popupViewInstance;
  };
  
  window.Views = window.Views || {};
  window.Views.EditUser = Backbone.View.extend(EditUser);

}());
