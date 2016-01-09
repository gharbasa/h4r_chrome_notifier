/*
 * Copyright (c) 2014, Gharbasa Inc.  All rights reserved.
*/

/*global Bkg*/
(function () {
  
  var popupView;
  //model here is the usersession model instance
  var UpdateUserAvatar = {
    className: 'update_user_avatar'
  };
  
  UpdateUserAvatar.events = {
    //'click #new_user_submit' : 'editUserClicked'
	'submit': 'updateUserAvatar'
  };
  
  UpdateUserAvatar.initialize = function () {
	  //console.log("EditUser.initialize::this.user= " + JSON.stringify(this.model));  
  };
  
  /**
   * Render EditUser 
   */
  UpdateUserAvatar.render = function () {
	//var loginUser = Bkg.users.getUserByIdentifier(this.model.get("id"));
	console.log("UpdateUserAvatar.render::this.user= " + this.model.fullName());
    this.$el
      //.attr({ 'id': this.model.get('id') })
      .html(Template('update_user_avatar')({
        user: this.model
      }));
    return this;
  };
  
  /**
   */
  UpdateUserAvatar.updateUserAvatar = function (e) {
    e.preventDefault();
    //e.stopPropagation();
    if(Bkg.DEBUG)
      console.log("EditUser.editUserClicked");
    //var loginUser = Bkg.users.getUserByIdentifier(this.model.get("id"));
    var file = $('#user_avatar')[0].files[0];//this.files[0];
    name = file.name;
    size = file.size;
    type = file.type;
    var content = "";
    var reader = new FileReader();
    var me = this;
    reader.onload = function(readerEvt) {
    	content = btoa(readerEvt.target.result);
    	console.log(name +":"+size+":"+type);
    	var avatar = {};
    	avatar.data = content;
    	avatar.filename = name;
    	avatar.content_type = type;
    	me.model.set("avatar", avatar);
    	me.model.save("",
  			  {
  		  		success: function (model, response) {
  		  			var msg = "User avatar is updated.";
  		  			console.log(msg);
  		  			me.$('.errors').show().text(msg);
  		  			Bkg.usersession.trigger("view:user_avatar:success","");
  		  		},
  		  		error: function (model, response) {
  		  			console.log("error Updating the user=" + JSON.stringify(response));
  		  			var responseText = JSON.parse(response.responseText);
  		  			var errorMsg = "";
  		  			if(responseText.errorMessage)
  		  				errorMsg = responseText.errorMessage[0];
  		  			else
  		  				errorMsg = response.statusText;
  		  			me.$('.errors').show().text(errorMsg);
  		  		}
  			  }
  	  );
    };
    reader.readAsBinaryString(file);
  }; 
  
  UpdateUserAvatar.setPopupView = function(popupViewInstance) {
    this.popupView = popupViewInstance;
  };
  
  window.Views = window.Views || {};
  window.Views.UpdateUserAvatar = Backbone.View.extend(UpdateUserAvatar);

}());
