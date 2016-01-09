/*
 * Copyright (c) 2014, Gharbasa Inc.  All rights reserved.
*/

/*global Bkg*/
(function () {
  
  var popupView;
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
    	this.createUser(params);
    //}
  }; 
  
  EditUser.createUser = function (params) {
	  console.log("Edit User view. Creating user.");
	  //var user = new Models.User(params);
	  //user.save(null,
	  if(this.model.isIdExists()) {
		  params.id = this.model.get("id");
	  }
	  this.model.save(params,
			  {
		  		success: function (model, response) {
		  			console.log("success, adding user to the collection");
		  			Bkg.users.add(model);
		  			this.$('.errors').show().text("Successfully created the user.");
		  			if(Bkg.usersession.isLoggedIn()) {
		  				//Show notifications panel in timeout.
		  				
		  			}
		  		},
		  		error: function (model, response) {
		  			console.log("error creating the user=" + JSON.stringify(response));
		  			var responseText = JSON.parse(response.responseText);
		  			var errorMsg = response.responseText;
		  			if(responseText.errorMessage)
		  				errorMsg = responseText.errorMessage;
		  			this.$('.errors').show().text(errorMsg[0]);
		  		}
			  }
	  );
	  /*
	  $.post(localStorage['api_host'] + "/api/1/users", params, "json")
      .always(function () {
        self.$('input[type=submit]').val("Create task").removeAttr("disabled");
      })
      .done(this.userCreated.bind(this))
      .fail(this.createUserFailed.bind(this));
      */
  };
  
  EditUser.userCreated = function (msg) {
	  console.log("Status message after user is created=" + JSON.stringify(msg));
  };
  
  EditUser.editUser = function (params) {
	  $.post(localStorage['api_host'] + "/api/1/users", params, "json")
      .always(function () {
        self.$('input[type=submit]').val("Create task").removeAttr("disabled");
      })
      .done(this.userCreated.bind(this))
      .fail(this.createUserFailed.bind(this));
  };
  
  EditUser.isCreateUser = function () {
	  return !this.model.isLoggedIn();
  };
  
  EditUser.setPopupView = function(popupViewInstance) {
    this.popupView = popupViewInstance;
  };
  
  window.Views = window.Views || {};
  window.Views.EditUser = Backbone.View.extend(EditUser);

}());
