/*
 * Copyright (c) 2016, Gharbasa Inc.  All rights reserved.
*/

/*global Bkg*/
(function () {
  
  var popupView;
  var registeredEvent = false;
  //model here is the login user model instance
  var UpdateUserAvatar = {
    className: 'update_user_avatar'
  };
  
  UpdateUserAvatar.events = {
	'submit': 'readUserAvatar'
  };
  
  UpdateUserAvatar.initialize = function () {
	  Bkg.usersession.on('view:user:avatar:readyToUpload', this.userAvatarReadyToUpload, this);
  };
  
  /**
   * Render EditUser 
   */
  UpdateUserAvatar.render = function () {
	var loginUser = Bkg.users.getUserByIdentifier(Bkg.usersession.get("id"));
	//console.log("UpdateUserAvatar.render::this.user= " + this.model.fullName());
    this.$el
      //.attr({ 'id': this.model.get('id') })
      .html(Template('update_user_avatar')({
        user: loginUser
      }));
    return this;
  };
  
  /**
   */
  UpdateUserAvatar.readUserAvatar = function (e) {
    e.preventDefault();
    //e.stopPropagation();
    if(Bkg.DEBUG)
      console.log("EditUser.readUserAvatar");
    //var loginUser = Bkg.users.getUserByIdentifier(this.model.get("id"));
    var file = $('#user_avatar')[0].files[0];//this.files[0];
    if(file == undefined)
    	return; //do nothing, no file attached.
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
    	Bkg.usersession.trigger("view:user:avatar:readyToUpload",avatar);
    };
    reader.readAsBinaryString(file);
  }; 
  
  UpdateUserAvatar.userAvatarReadyToUpload = function(avatar) {
	  console.log("userAvatarReadyToUpload::Hey, user avatar base64 content is ready to upload");
	  var loginUser = Bkg.users.getUserByIdentifier(Bkg.usersession.get("id"));
	  loginUser.set("avatar", avatar);
	  loginUser.save(avatar,
			  {
		  		success: function (model, response) {
		  			var msg = "User avatar is updated.";
		  			console.log(msg);
		  			this.$('.errors').show().text(msg);
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
		  			this.$('.errors').show().text(errorMsg);
		  		}
			  }
	  );
  };
  
  UpdateUserAvatar.setPopupView = function(popupViewInstance) {
    this.popupView = popupViewInstance;
  };
  
  window.Views = window.Views || {};
  window.Views.UpdateUserAvatar = Backbone.View.extend(UpdateUserAvatar);

}());
