
(function () {

  var Popup = {};
  var watcherSource = ""; //To know the context in which the watcher was launched
  //Can't initialize watchersSelected with Bkg.account.get('id');
  var watchersSelected = ""; //Selected list of watcher ids comma separated
  var projectId4Watchers = ""; //Current project's people in the watchers list form.
  Popup.events = {
    'click .js-new-task':   'toggleNewTask',
    'click .js-open-tb':    'openCAWM',
    'click .js-open-tasks': 'openTasks',
    'click .js-new-conversation': 'toggleNewConversation',
    'click input[name=notify_done]': 'doneSelectingWatchers',
    'click div[class=watcher]' : 'flipWatcherCheckbox',
    'click .js_notify_select_none': 'selectNoneWatchers',
    'click .js_notify_select_all': 'selectAllWatchers',
    'click .created_task_conv_link': 'createdLinkClick',
    'blur #created_task_conv_link_textbox': 'linkTextboxBlur'
  };
  
  //_.extend(Popup, Backbone.Events);
  
  Popup.initialize = function () {
    if(Bkg.DEBUG)
      console.log("Popup.initialize Bkg.usersession=" + JSON.stringify(Bkg.usersession));
    //var currentUser = Bkg.users.getUserByIdentifier(Bkg.usersession.get("id"));
    this.notifications_view = new Views.Notifications({ collection: Bkg.notifications });
    this.userprofile_view = new Views.Userprofilesettings({model: Bkg.usersession});
    this.edit_user_view = new Views.EditUser({model: Bkg.usersession});
    this.update_user_avatar = new Views.UpdateUserAvatar();
    this.header_view = new Views.Header();
    this.login_view = new Views.Login();
    this.userprofile_view.setPopupView(this);
    this.login_view.setPopupView(this);
    this.edit_user_view.setPopupView(this);
    this.update_user_avatar.setPopupView(this);
    this.header_view.setPopupView(this);
    
    Bkg.usersession.on('usersession:expired', this.userSessionExpiredEvent, this);
    //Bkg.usersession.on('usersession:saved', this.userEditedEvent, this);
    Bkg.usersession.on('view:show:edit_user', this.showEditUserViewEvent, this);
    Bkg.usersession.on('view:show:create_user', this.showCreateUserViewEvent, this);
    Bkg.usersession.on('view:create_user:success', this.userEditedEvent, this);
    Bkg.usersession.on('view:update_user:success', this.userEditedEvent, this);
    Bkg.usersession.on('view:show:update_avatar', this.showUpdateAvatarViewEvent, this);
    Bkg.usersession.on('view:user_avatar:success', this.udpatedUserAvatarEvent, this);
    
    //this.new_task_view = new Views.NewTask();
    //this.new_conversation_view = new Views.NewConversation();
    //this.users_view = new Views.Users({ collection: Bkg.users });
    //this.new_search_view = new Views.NewSearch();
    //Backbone doesn't allow views to be shared. You will need to share a reference to view1 in view2:
    //this.new_task_view.setPopupView(this);
    //this.new_conversation_view.setPopupView(this);
    //this.new_search_view.setPopupView(this);
    //this.users_view.setPopupView(this);
  };
  
  Popup.toggleUserProfileView = function (e) {
    e.preventDefault();
    if(Bkg.DEBUG)
    	console.log("toggleUserProfileView:: Toggling userprofileview");
    this.userprofile_view.$el.toggle();
    if (this.userprofile_view.$el.is(':visible')) {
    	console.log("toggleUserProfileView-userprofile is visible, re-render it.");
    	this.userprofile_view.render();
    	this.hideLoginView();
    	this.hideNotifications();
    	this.hideEditUserView();
    	this.hideUpdateAvatarView();
    	this.activateCurrentTab(Bkg.USER);
        //this.hideNewConversation();
        //this.hideWatchersList();
        //this.initializeTaskView();
    }
    else
    {
    	console.log("toggleUserProfileView-userprofile is hidden");
    	if (Bkg.usersession.isLoggedIn()) {
    		console.log("User is logged -in, so show notifications");
    		this.showNotifications();
    		this.hideEditUserView();
    		this.activateCurrentTab("");
    	} else {
    		console.log("User is NOT logged -in, so show login screen.");
    		this.showLoginScreen();
    	}
    }
  };
  
  
  Popup.userSessionExpiredEvent = function(msg) {
	  console.log("userSessionExpiredEvent, preparing login screen.");
	  Bkg.clearCache();
	  //this.$(".user").text(Bkg.usersession.fullName());
	  this.header_view.render();
	  //this.hideNotifications();
	  this.hideUserProfileMenu();
	  //this.hideEditUserView();
	  this.showLoginScreen();
  };
  
  Popup.showEditUserViewEvent = function(msg) {
	  console.log("Popup.showEditUserViewEvent");
	  this.hideUserProfileMenu();
	  this.showEditUserView();
  };
  
  Popup.showUpdateAvatarViewEvent = function(msg) {
	  console.log("Popup.showUpdateAvatarViewEvent");
	  this.hideUserProfileMenu();
	  this.showUpdateAvatarView();
  };
  
  Popup.showCreateUserViewEvent = function(msg) {
	  console.log("Popup.showCreateUserViewEvent");
	  this.hideUserProfileMenu();
	  this.showCreateUserView();
  };
  
  Popup.udpatedUserAvatarEvent = function(msg) {
	  console.log("udpatedUserAvatarEvent.");
	  this.hideUpdateAvatarView();
	  var loginUser = Bkg.users.getUserByIdentifier(Bkg.usersession.get("id"));
	  //loginUser.fetch({});
	  this.showNotifications();
  };
  
  Popup.userEditedEvent = function(msg) {
	  console.log("userEditedEvent.");
	  this.hideEditUserView();
	  this.header_view.render();
	  if(Bkg.usersession.isLoggedIn()) {
		  var loginUser = Bkg.users.getUserByIdentifier(Bkg.usersession.get("id"));
		  console.log("userEditedEvent. User is logged-in, show notifications screen;" + loginUser.fullName());
		  //this.$(".user").text(loginUser.fullName());
		  this.showNotifications();
	  } else {
		  //this.$(".user").text(Bkg.usersession.fullName());
		  Bkg.clearCache();
		  this.hideNotifications();
		  this.showLoginScreen();
	  }
  };
  
  Popup.showLoginScreen = function () {
	  this.login_view.$el.show();
  };
  
  Popup.showUpdateAvatarView = function () {
	  this.update_user_avatar.model = Bkg.users.getUserByIdentifier(Bkg.usersession.get("id"));
	  this.update_user_avatar.render();
	  this.update_user_avatar.$el.show();  
  };
  
  Popup.hideUpdateAvatarView = function () {
	  this.update_user_avatar.$el.hide();  
  };
  
  Popup.hideEditUserView = function () {
	this.edit_user_view.$el.hide();
  };
  
  Popup.showEditUserView = function () {
	  this.edit_user_view.model = Bkg.users.getUserByIdentifier(Bkg.usersession.get("id"));
	  this.edit_user_view.render();
	  this.edit_user_view.$el.show();
  };
  
  Popup.showCreateUserView = function () {
	  this.edit_user_view.model = new Models.User();
	  this.edit_user_view.render();
	  this.edit_user_view.$el.show();
  };
  
  Popup.hideUserProfileMenu = function () {
	  console.log("Hiding user profile menu");
	  this.userprofile_view.$el.hide();
  };
  
  Popup.hideLoginView = function () {
	  this.login_view.$el.hide();
  };
  
  Popup.activateCurrentTab = function(tabName){
    this.$(".new_conversation").removeClass('currentactivelink');
    this.$(".new_task").removeClass('currentactivelink');
    this.$(".icon-home-header").removeClass('currentactivelink');
    this.$(".user").removeClass('currentactivelink');
    
    if(tabName === Bkg.CONV_FORM){
      this.$(".new_conversation").addClass('currentactivelink');
    }
    else if(tabName === Bkg.TASK_FORM){
      this.$(".new_task").addClass('currentactivelink');
    }
    else if(tabName === Bkg.USER){
        this.$(".user").addClass('currentactivelink');
    } else {
    	this.$(".icon-home-header").addClass('currentactivelink');
    }
  };
  
  Popup.toggleNewTask = function (e) {
    if(Bkg.DEBUG)
      console.log("toggleNewTask:: Toggling taskView");
    e.preventDefault();
    this.new_task_view.$el.toggle();        
    if (this.new_task_view.$el.is(':visible')) {
      this.hideNotifications();
      this.hideNewConversation();
      this.hideWatchersList();
      this.initializeTaskView();
    }
    else
    {
      this.showNotifications();
      this.$(".new_task").removeClass('currentactivelink');
    }
  };
  
  /**
   *  Load the default values into the task input controls.
   */
  Popup.initializeTaskView = function() {
    if(Bkg.DEBUG)
      console.log("initializeTaskView");
    this.activateCurrentTab(Bkg.TASK_FORM);
    var content = this.buildContentBody();
    trackEvent(Bkg.TASK_FORM, "Open");
    this.setFocus('#name');
    //Auto-populate browser tab content, https://cawm.ca.com/a/index.html#!/projects/98/tasks/32795
    this.new_task_view.$('input[name=name]').val(Bkg.tabTitle);
    this.new_task_view.$('textarea[name=body]').val(content);
    this.new_task_view.$('input[name="task_show_watchers"]').val(Bkg.NOTIFY_ONE_PERSON_LABEL);
    this.new_task_view.$('.errors').hide();
    var taskViewCurrProjectId = this.new_task_view.$('select[name=project_id]').val();
    if(this.projectId4Watchers != taskViewCurrProjectId) //Conversation view might be having different project then task view.
    {
      if(Bkg.DEBUG)
        console.log("Project id in the task view is different from project Watchers in the watcher View. Updating watcher view");
      this.updateWatchersView(taskViewCurrProjectId);
    }
    else
    {
      if(Bkg.DEBUG)
        console.log("Project id in the task view is the same as project Watchers in the watcher View.");
      this.uncheckWatcherCheckboxes();
      this.resetInstanceVariables();
    }
  };
  
  /*
   * Open new conversation form
   */
  Popup.toggleNewConversation = function (e) {
    if(Bkg.DEBUG)
      console.log("toggleNewConversation");
    e.preventDefault();
    this.new_conversation_view.$el.toggle();       
    if (this.new_conversation_view.$el.is(':visible')) {
      this.hideNotifications();
      this.hideNewTask();
      this.hideWatchersList();
      this.initializeConversationView();
    }
    else
    {
      this.showNotifications();
      this.$(".new_conversation").removeClass('currentactivelink');
    }
  };
  
  /**
   * Load default values into conversation input controls.
   */
  Popup.initializeConversationView = function() {
    if(Bkg.DEBUG)
      console.log("initializeConversationView");
    this.activateCurrentTab(Bkg.CONV_FORM);
    var content = this.buildContentBody();
    trackEvent(Bkg.CONV_FORM, "Open");
    this.setFocus('#conv_name');
    //Auto-populate browser tab content, https://cawm.ca.com/a/index.html#!/projects/98/tasks/32795
    this.new_conversation_view.$('input[name=conv_name]').val(Bkg.tabTitle);
    this.new_conversation_view.$('textarea[name=conv_body]').val(content);
    this.new_conversation_view.$('input[name="conv_show_watchers"]').val(Bkg.NOTIFY_ONE_PERSON_LABEL);
    this.new_conversation_view.$('.errors').hide();
    var convViewCurrProjectId = this.new_conversation_view.$('select[name=conv_project_id]').val();
    if(this.projectId4Watchers != convViewCurrProjectId) //Conversation view might be having different project then task view.
    {
      if(Bkg.DEBUG)
        console.log("Project id in the conv. view is different from project Watchers in the watcher View. Updating watcher view");
      this.updateWatchersView(convViewCurrProjectId);
    }
    else
    {
      if(Bkg.DEBUG)
        console.log("Project id in the conv. view is the same as project Watchers in the watcher View.");
      this.uncheckWatcherCheckboxes();
      this.resetInstanceVariables();
    }
  };
  
  Popup.buildContentBody = function() {
    var content = "";
    var sourceString = "Source: ";
    if(Bkg.tabContent != null && Bkg.tabContent != "") {
      content = Bkg.tabContent + "\n\n" + sourceString + Bkg.tabUrl;
    } else {
      content = sourceString + Bkg.tabUrl;
    }
    return content;
  };
  
  /**
   * Render header, New Task dialog, Notifications
   */
  Popup.render = function () {
    if(Bkg.DEBUG)
      //console.log("Popup.render::Bkg.selectedContextMenuId=" + Bkg.selectedContextMenuId + 
      //     ", Bkg.fromContextMenu=" + Bkg.fromContextMenu);
    console.log("Popup.render=" + JSON.stringify(Bkg.usersession));
    //this.$el.html(Template('header')());
    this.$el.append(this.header_view.render().$el);
    this.resetInstanceVariables();
    //this.$el.append(this.new_search_view.render().$el);
    //this.$el.append(this.users_view.render().$el.hide()); //Its good to be the 1st one rendered
    /*
    if(Bkg.fromContextMenu === 1)
    {
      if(Bkg.selectedContextMenuId.indexOf(Bkg.CONV_CONTEXT_MENU) > -1)
      {
        this.$el.append(this.new_task_view.render().$el.hide());
        this.$el.append(this.new_conversation_view.render().$el);
        this.$el.append(this.notifications_view.render().$el.hide());
        this.initializeConversationView();
      }
      else if(Bkg.selectedContextMenuId.indexOf(Bkg.TASK_CONTEXT_MENU) > -1)
      {
        this.$el.append(this.new_task_view.render().$el);
        this.$el.append(this.new_conversation_view.render().$el.hide());
        this.$el.append(this.notifications_view.render().$el.hide());
        this.initializeTaskView();
      }
    }
    else
    {
    */
      //this.$el.append(this.new_task_view.render().$el.hide());
      //this.$el.append(this.new_conversation_view.render().$el.hide());
      //this.$el.append(this.notifications_view.render().$el);
    	
    //}
    if (Bkg.usersession.isLoggedIn()) {
    	console.log("User is logged-in");
    	this.$el.append(this.notifications_view.render().$el);
    	this.$el.append(this.login_view.render().$el.hide());
    }
    else {
    	console.log("User is NOT logged-in");
    	this.$el.append(this.login_view.render().$el);
    }
    
    this.$el.append(this.userprofile_view.render().$el.hide());
    this.$el.append(this.edit_user_view.render().$el.hide());
    this.$el.append(this.update_user_avatar.render().$el.hide());
    return this;
  };
  
  Popup.openCAWM = function () {
    trackEvent("open_cawm", "Click");
  };
  
  Popup.openTasks = function () {
    trackEvent("open_tasks", "Click");
  };
  
  Popup.neededCollectionsAreLoaded = function () {
    return Bkg.projects.length > 0 &&
           Bkg.people.length > 0 &&
           Bkg.account.id;
  };
  
  //Toggle(hide/show) notifications panel: https://cawm.ca.com/a/index.html#!/projects/98/tasks/32771
  Popup.hideNotifications = function () {
    this.notifications_view.$el.hide();
  };
  
  Popup.showNotifications = function () {
    if(Bkg.DEBUG) console.log("In the beginning of showNotifications");
    this.notifications_view.$el.show();
    this.$(".icon-home-header").addClass('currentactivelink');
    this.setFocus("#search_box_field");
  };
  
  Popup.hideNewTask = function () {
    this.new_task_view.$el.hide();
  };
  
  Popup.showNewTask = function () {
    this.new_task_view.$el.show();
  };

  Popup.hideNewConversation = function () {
    this.new_conversation_view.$el.hide();
  };
  
  Popup.showNewConversation = function () {
    this.new_conversation_view.$el.show();
  };

  Popup.searchFromPopupView = function (keyword){
    if(Bkg.DEBUG) console.log("search keyword:" + keyword);
    trackEvent("new search", keyword);
    if(keyword.length > 0) {
      var newurl = Bkg.settings.apiHost + '/#!/search?query=' + encodeURIComponent(keyword);
      chrome.tabs.create({ url: newurl });
    }
  };
  
  Popup.showWatchersList = function (source) {
    this.users_view.$el.show();
    this.watcherSource = source;
    //Set focus on login user's checkbox.
    var loginUserId = Bkg.account.get('id');
    if(Bkg.DEBUG) console.log("Focus will be set on checkbox" + loginUserId);
    this.setFocus('#checkbox' + loginUserId);
  };
  
  Popup.hideWatchersList = function () {
    this.users_view.$el.hide();
  };
 
  Popup.emptyWatchersView = function () {
    if(Bkg.DEBUG)
      console.log("emptyWatchersView");
    this.users_view.$el.empty();
    this.users_view.$el.empty().off();
  };

  Popup.updateWatchersView = function (project_id) {
    if(Bkg.DEBUG)
      console.log("updateWatchersView");
    this.emptyWatchersView();
    this.users_view.render(project_id);
    //Change button label to watcher(0) and clear the local buffer
    this.resetInstanceVariables();
    this.new_task_view.$('input[name="task_show_watchers"]').val(Bkg.NOTIFY_ONE_PERSON_LABEL);
    this.new_conversation_view.$('input[name="conv_show_watchers"]').val(Bkg.NOTIFY_ONE_PERSON_LABEL);
    this.projectId4Watchers = project_id;
  };
  
  //User is clicked done button from Watchers view
  Popup.doneSelectingWatchers = function(e) {
    if(Bkg.DEBUG)
      console.log("You have clicked done button from watchers list view - in the context of " + this.watcherSource);
    e.preventDefault();
    //Query and build comma separated list of user_ids
    this.watchersSelected = "";
    var watchersCheckboxesArray = this.users_view.$('.watcher_checkbox');
    if(Bkg.DEBUG) console.log("The number of checkboxes in watchers view.." + watchersCheckboxesArray.length); 
    for(var i=0; i<watchersCheckboxesArray.length; i++) {
      var checkboxObj = watchersCheckboxesArray[i];
      if(checkboxObj.checked) {
        var userId = checkboxObj.getAttribute("userid");
        if(Bkg.DEBUG) console.log("Watcher to include.." + userId);
        this.watchersSelected += userId + ",";
      }
    }
    if(this.watchersSelected != "")
      this.watchersSelected = this.watchersSelected.substring(0, this.watchersSelected.length - 1);

    if(Bkg.DEBUG) console.log("Final list of watchers to include:" + this.watchersSelected);
    
    this.hideWatchersList();
    //show either new task/new conversation
    var count = this.selectedWatchersCount();
    var label = this.compileWatcherLabel(count);
    if(this.watcherSource === Bkg.TASK_FORM) {
      this.showNewTask();
      //Update Watchers count in the button.
      this.new_task_view.$('input[name="task_show_watchers"]').val(label);
      this.setFocus('#new_task_submit');
    }
    else if(this.watcherSource === Bkg.CONV_FORM) {
      this.showNewConversation();
      //Update Watchers count in the button.
      this.new_conversation_view.$('input[name="conv_show_watchers"]').val(label);
      this.setFocus('#new_conv_submit');
    }
  };
  
  Popup.compileWatcherLabel = function (count) {
    var label = Bkg.NOTIFY_ONE_PERSON_LABEL;
    if(count > 1) {
      label = Bkg.NOTIFY_PEOPLE_LABEL;
      label = label.replace("\%d", count);
    }
    return label;
  };
  
  /**
   * User clicked on the username/user's avatar
   *   In this case, we have to explicitly flip checkbox and then decide either to 
   *   include / exclude the user from watchers list.
   */
  Popup.flipWatcherCheckbox = function (e) {
    e.preventDefault();
    var divTag = e.currentTarget;
    var userId = divTag.id;
    if(Bkg.DEBUG)
      console.log("flipWatcherCheckbox, userID=" + userId);
    
    if(isMe(userId)) return; //This function is defined in utils.js
    
    var checkBoxObj = this.users_view.$('input[id=checkbox' + userId + ']');
    checkBoxObj.attr('checked', !checkBoxObj.attr('checked'));
  }; 
  
  Popup.resetInstanceVariables = function() {
    //uncheck the checboxes from the watcher list
    this.watcherSource = "";
    this.watchersSelected = Bkg.usersession.get('id') + "";
    if(Bkg.DEBUG)
      console.log("resetInstanceVariables::this.watchersSelected=" + this.watchersSelected);
  };
  
  Popup.uncheckWatcherCheckboxes = function() {
    if(Bkg.DEBUG)
      console.log("uncheckWatcherCheckboxes");
    if(this.selectedWatchersCount() > 0) {
      var selWatchersArray = this.watchersSelected.split(",");
      for(var i=0; i<selWatchersArray.length; i++) {
        var userId = selWatchersArray[i];
        if(!isMe(userId))
          this.users_view.$('input[id=checkbox' + userId + ']').attr('checked', false);
      }
    }
  };
  
  Popup.selectedWatchersCount = function() {
    if(Bkg.DEBUG)
      console.log("selectedWatchersCount");
    var count = 0;
    if(this.watchersSelected != null && this.watchersSelected != "") {
      var selWatchersArray = this.watchersSelected.split(",");
      count = selWatchersArray.length;
    }
     return count;
  };
  
  Popup.getSelectedWatchers = function() {
    return this.watchersSelected;
  };
  
  Popup.buildWatchersAsJSonArray = function() {
    if(Bkg.DEBUG)
      console.log("buildWatchersAsJSonArray");
    var watcher_ids = [];
    if(this.watchersSelected != null && this.watchersSelected != "") {
      var selWatchersArray = this.watchersSelected.split(",");
      var found = false;
      for(var i=0; i<selWatchersArray.length; i++) {
        var id = selWatchersArray[i];
        watcher_ids.push(id);
      }
    }
    return watcher_ids;
  };
  
  Popup.selectAllWatchers = function() {
    if(Bkg.DEBUG)
      console.log("selectAllWatchers");
    var checkboxArray = this.users_view.$('.watcher_checkbox');
    for(var i=0; i<checkboxArray.length; i++) {
      var checkboxObj = checkboxArray[i];
      var userId = checkboxObj.getAttribute("userid");
      if(isMe(userId)) continue;
      checkboxObj.checked = true;
    }
    if(Bkg.DEBUG)
      console.log("selectAllWatchers, this.watchersSelected=" + this.watchersSelected);
  };
  
  Popup.selectNoneWatchers = function() {
    if(Bkg.DEBUG)
      console.log("selectNoneWatchers");
    var checkboxArray = this.users_view.$('.watcher_checkbox');
    for(var i=0; i<checkboxArray.length; i++) {
      var checkboxObj = checkboxArray[i];
      var userId = checkboxObj.getAttribute("userid");
      if(isMe(userId)) continue;
      checkboxObj.checked = false;
    }
    if(Bkg.DEBUG)
      console.log("selectNoneWatchers, this.watchersSelected=" + this.watchersSelected);
  };
  /*
   * Set focus on the control depending on the form visible.
   * control_name
   *   Name of the control, id attribute (prefixed with # is recommended)
   */
  Popup.setFocus = function (control_name) {
    if(Bkg.DEBUG) console.log("In the beginnig of setFocus() method, control_name=" + control_name);
    var CONTEXT_LAUNCH_TIME_INTERVAL = 600; //half second, this is bit longer time, its because rendering happens on the fly.
    var GENERAL_TIME_INTERVAL = 150; //Rendering already happened, its just a hide/visible.
    var timeInterval = GENERAL_TIME_INTERVAL;
    
    if(control_name === undefined ||
       control_name === null ||
       control_name === "" ||
       control_name.length === 0
      ) { 
      if(Bkg.selectedContextMenuId.indexOf(Bkg.CONV_CONTEXT_MENU) > -1)
        control_name = "#new_conv_submit"; 
      else if(Bkg.selectedContextMenuId.indexOf(Bkg.TASK_CONTEXT_MENU) > -1)
        control_name = "#new_task_submit";
      else
        control_name = "#search_box_field";
      timeInterval = CONTEXT_LAUNCH_TIME_INTERVAL;
    }
    
    setTimeout(function() {
          this.$(control_name).focus();
    }, timeInterval);
  };
  
  Popup.createdLinkClick = function (e) {
    e.preventDefault();
    if(Bkg.DEBUG)
      console.log("Popup.createdLinkClick");
    var textBox;
    if (this.new_task_view.$el.is(':visible')) {
      var displayedLink = this.new_task_view.$('.created_task_conv_link').text();
      textBox = buildLinkTextbox(displayedLink);
      this.new_task_view.$('.created_url_display').html(textBox);
    } else if (this.new_conversation_view.$el.is(':visible')) {
      var displayedLink = this.new_conversation_view.$('.created_task_conv_link').text();
      textBox = buildLinkTextbox(displayedLink);
      this.new_conversation_view.$('.created_url_display').html(textBox);
    }

    if(textBox) {
      textBox.focus();
      textBox.select();
    }
  };
  
  //Onblur Replace textbox with link(span tag) to just display the link
  Popup.linkTextboxBlur = function (e) {
    e.preventDefault();
    if(Bkg.DEBUG)
      console.log("Popup.linkTextboxBlur");
    var linkURL = this.$("#created_task_conv_link_textbox").val();
    var string = buildCreatedLink(linkURL);
    if (this.new_task_view.$el.is(':visible')) {
      this.new_task_view.$('.created_url_display').html(string);
    } else if (this.new_conversation_view.$el.is(':visible')) {
      this.new_conversation_view.$('.created_url_display').html(string);
    }
  };
  
  Popup.hideAllAndShowNotifications = function (e) {
    e.preventDefault();
    if(Bkg.DEBUG) console.log("In the beginning of hideAllAndShowNotifications");
    this.hideUserProfileMenu();
    this.hideEditUserView();
    this.hideUpdateAvatarView();
    if (Bkg.usersession.isLoggedIn()) {
    	this.showNotifications();
    } else {
    	this.hideNotifications();
    	this.showLoginScreen();
    }
    this.activateCurrentTab("");
  };
  
  //not used, its only reference
  Popup.renderNotifications = function () {
	    if(Bkg.DEBUG) console.log("In the beginning of showNotifications");
	    this.userEditedEvent("");
	    
	    /*
	    if (this.new_task_view.$el.is(':visible')) {
	      if(Bkg.DEBUG) console.log("New task form is visible. Hiding it");
	      this.new_task_view.hideDialog(); //This will hide new task form and show notifications
	    }
	    else if (this.new_conversation_view.$el.is(':visible')) {
	      if(Bkg.DEBUG) console.log("New conversation form is visible. Hiding it");
	      this.new_conversation_view.hideDialog(); //This will hide new task form and show notifications
	    } else if(this.users_view.$el.is(':visible')) { //watchers are visible in the context of new task/conversation
	      if(Bkg.DEBUG) console.log("Watchers form is visible. Hiding it");
	      this.hideWatchersList();
	      if(this.watcherSource === Bkg.TASK_FORM)
	        this.$(".new_task").removeClass('currentactivelink');
	      else if(this.watcherSource === Bkg.CONV_FORM)
	      	this.$(".new_conversation").removeClass('currentactivelink');
	      this.showNotifications();
	    }*/
	    
  };
  
  window.Views = window.Views || {};
  window.Views.Popup = Backbone.View.extend(Popup);

}());
