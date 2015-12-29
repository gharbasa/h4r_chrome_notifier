/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

/*global Bkg*/
(function () {
  
  var popupView;
  var params;
  var NewConversation = {
    className: 'new_conversation'
  };

  NewConversation.events = {
    'change select[name=conv_project_id]': 'updatedProject',
    'submit': 'submitConversation',
    'click input[name=conv_show_watchers]': 'showWatchersList'
  };

  function getConversationParams($form) {
    var params = $form.serializeObject();
    
    params.name = params.conv_name; //its the name attribute that holds title of the conversation
    params.project_id = params.conv_project_id;
    //params.description = params.conv_body;

    return params;
  }
  
  NewConversation.updatedProject = function (e) {
    var project_id = this.$('select[name=conv_project_id]').val();
    //Update watchers view with the people of the selected projects.
    this.popupView.updateWatchersView(project_id);
  };
  
  NewConversation.hideDialog = function (e) {
    this.$el.hide();
    $(".new_conversation").removeClass('currentactivelink');
    //Toggle Notifications panel - show
    this.popupView.showNotifications();
  };

  /**
   * Prepare conversation data and send to cawm
   * Post Conversation is a 2 step process
   *   1. Create conversation by posting its title only(conversation doesn't have description)
   *   2. Post comment to the newly create conversation
   */
  NewConversation.submitConversation = function (e) {
    e.preventDefault();

    var self = this;
    this.params = getConversationParams(this.$('form'));

    if ((this.params.conv_name || "").length === 0) {
      this.$('.errors').show().text("Please enter a title for your conversation");
      return;
    }
    
    //watchers have to be submitted as array of user ids.
    this.params.watcher_ids = this.popupView.buildWatchersAsJSonArray();
    
    self.$('input[type=submit]').val("Loading...").attr("disabled", "disabled");
    
    $.post(localStorage['api_host'] + "/api/2/conversations", this.params, "json")
      .always(function () {
        self.$('input[type=submit]').val("Create Conversation").removeAttr("disabled");
      })
      .done(this.conversationCreated.bind(this))
      .fail(this.conversationFailed.bind(this));
  };

  /**
   * Success message after creating a new conversation
   */
  NewConversation.conversationCreated = function (data) {
    data = JSON.parse(data);
    
    // Success message
    var launchUrl = localStorage['api_host'] + '/#!/projects/' + data.project_id +
                     '/conversations/' + data.id;
    var $span = $('<span>').text("Conversation created: ");
    var hashTaggedTitle = applyHashTags(data.name, launchUrl);
    var $title = $('<span>').html(hashTaggedTitle);
    $title.addClass('success');
    $span.append($title);
	
    this.$('.errors').html($span);
	
    var string = buildCreatedLinkMain(launchUrl);
    this.$('.errors').append(string).show();
	
    trackEvent(Bkg.CONV_FORM, 'Created Conversation');
    
    // Save params for better next conversation creation
    Bkg.settings.set('last/project_id', data.project_id);
    
    this.resetForm();
    //Post comment to this newly created conversation
    this.postComment(data);
  };

  NewConversation.conversationFailed = function (r) {
    this.$('.errors').show().text("Error creating conversation");
    trackEvent(Bkg.CONV_FORM, 'Failed', JSON.stringify(r));
  };
  
  /*
   * param:
   * 	data: response json data after creating conversation
   */
  NewConversation.postComment = function (data) {
    
    var self = this;
    
    //If comment content is empty, do nothing    
    if ((this.params.conv_body || "").length === 0) {
      return;
    }

    self.$('input[type=submit]').val("Loading...").attr("disabled", "disabled");
    
    var url = localStorage['api_host'] + "/api/2/projects/" + data.project_id + "/comments";
    this.params.target_id = data.id;  //Newly created conversation id
    this.params.target_type = "Conversation";
    this.params.body = this.params.conv_body;
    
    $.post(url, this.params, "json")
      .always(function () {
        self.$('input[type=submit]').val("Create Conversation").removeAttr("disabled");
      })
      .done(this.commentCreated.bind(this))
      .fail(this.commentFailed.bind(this));
  };
  
  /**
   * Success message after posting comment to the conversation
   */
  NewConversation.commentCreated = function (data) {
    data = JSON.parse(data);
    trackEvent('post_comment_to_new_conversation', 'Posted comment to new Conversation');
    //Do nothing right now.
  };

  /**
   * Failed posting comment to the conversation
   */
  NewConversation.commentFailed = function (r) {
    this.$('.errors').show().text("Error posting comment to conversation");
    trackEvent('post_comment_to_new_conversation', 'Failed', JSON.stringify(r));
  };
  
  /**
   * Preselect the project, either from the user's tb settings or
   * from the last one used successfully in this extension (prioritary)
   */
  NewConversation.preselectProject = function () {
    var project_id =
      Bkg.settings.get('last/project_id') ||
      +Bkg.account.get('settings').last_quick_project;

    this.$('select[name=conv_project_id]').val(project_id);
  };

  NewConversation.render = function () {
    if (this.popupView.neededCollectionsAreLoaded()) {
      this.$el.html(Template(Bkg.CONV_FORM)());
      this.preselectProject();
      $(this.el).loadSavedTextareas();
    } else {
      this.$el.html("<p class='message-dialog'>We are still loading your data, please try again.</p>");
      trackEvent(Bkg.CONV_FORM, "Missing collections to load", Bkg.usersession.id);
    }

    return this;
  };

  /**
   * Reset the form inputs for a new conversation
   */
  NewConversation.resetForm = function () {
    this.$('input[name=conv_name], textarea').val("");
    this.$('input[name="conv_show_watchers"]').val(Bkg.NOTIFY_ONE_PERSON_LABEL);
    this.popupView.uncheckWatcherCheckboxes();
  	this.popupView.resetInstanceVariables();
  	this.popupView.setFocus("#conv_name");
  };
  
  NewConversation.setPopupView = function(popupViewInstance) {
    this.popupView = popupViewInstance;
  };
  
  NewConversation.showWatchersList = function(e) {
    if(Bkg.DEBUG)
      console.log("You have clicked watchers list button from conversation view");
    e.preventDefault();
    this.popupView.hideNewConversation();
    this.popupView.showWatchersList(Bkg.CONV_FORM);
  };
  
  window.Views = window.Views || {};
  window.Views.NewConversation = Backbone.View.extend(NewConversation);

}());
