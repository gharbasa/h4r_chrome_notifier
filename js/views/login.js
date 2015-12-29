
/*global Bkg*/
(function () {
  
  //var popupView;
  var Login = {
    className: 'login'
  };

  Login.events = {
    'click input[name=btnlogin]': 'peformLogin'
  };
  
  Login.render = function () {
	  if(Bkg.DEBUG)
		  console.log("Login.render");
	  this.$el.html(Template(Bkg.LOGIN)());
	  return this;
  };
  
  function getFormParams($form) {
	    var params = $form.serializeObject();
	    return params;
  };
  
  Login.peformLogin = function(e) {
    if(Bkg.DEBUG)
      console.log("User is performing login action.");
    e.preventDefault();
    
    var self = this
    , params = getFormParams(this.$('form'));

    if ((params.login || "").length === 0) {
    	this.$('.errors').show().text("Username can not be empty");
    	return;
    }
  
    if ((params.password || "").length === 0) {
    	this.$('.errors').show().text("Password can not be empty");
    	return;
    }
    var payload = JSON.parse("{}");
    //var payload = {"login": this.$('#login').value, "password": this.$('#password').value};
    payload['usersession'] = JSON.parse("{}");
    payload['usersession']['login'] = $('#login').val();
    payload['usersession']['password'] = $('#password').val();
    console.log("payload=" + JSON.stringify(payload));
    self.$('input[type=button]').val("Loading...").attr("disabled", "disabled");

    $.post(localStorage['api_host'] + "/api/1/usersession", payload, "json")
    .always(function () {
      self.$('input[type=button]').val("Login").removeAttr("disabled");
    })
    .done(this.loginSuccessful.bind(this))
    .fail(this.loginFailed.bind(this));
    //this.popupView.hideNewTask();
    //this.popupView.showWatchersList(Bkg.TASK_FORM);
  };
  
  Login.loginSuccessful = function(r) {
	console.log("Login is successful." + JSON.stringify(r));
	Bkg.refresh(true);
	var popup = new Views.Popup();
	this.$el.hide();
	setTimeout(
				function() {
					$("#content").append(popup.render().el);
				}, 2000 //more time is not good for user to wait.
	);
  };
  
  Login.loginFailed = function(r) {
	console.log("Login Failed." + JSON.stringify(r));
	var responseText = r.responseText;
	var json = JSON.parse(responseText);
	this.$('.errors').show().text(json.errorMessage[0]);
	//{"readyState":4,"responseText":"{\"errorMessage\":[\"You did not provide any details for authentication.\"]}","status":422,"statusText":"Unprocessable Entity"}
  };
  
  window.Views = window.Views || {};
  window.Views.Login = Backbone.View.extend(Login);

}());
