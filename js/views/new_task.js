/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

/*global Bkg*/
(function () {
  
  var popupView;
  var NewTask = {
    className: 'new_task'
  };

  NewTask.events = {
    'change select[name=project_id]': 'updatedProject',
    'submit': 'submitTask',
    'click input[name=task_show_watchers]': 'showWatchersList',
  };
  
  function getTaskParams($form) {
    var params = $form.serializeObject()
      , today = new Date()
      , offset = -1
      , regday = new RegExp(/([0-9]+) days/);

    // They're passed as a combo from status_and_assigned, which has values like '0', '1-0', '1-2'
    params.status = params.status_and_assigned.split('-')[0];
    params.assigned_id = params.status_and_assigned.split('-')[1];

    // Due on keywords
    if (params.due_on === 'today') {
      offset = 0;
    } else if (params.due_on === 'tomorrow') {
      offset = 1;
    } else if (params.due_on === 'next week') {
      offset = 7;
    } else if (params.due_on === 'next month') {
      offset = 30;
    } else if (regday.test(params.due_on)) {
      offset = +(params.due_on.replace(regday, "$1"));
    }

    if (offset >= 0) {
      params.due_on = new Date((today).getTime() + offset * 24 * 60 * 60 * 1000);
    }

    params.description = params.body;

    return params;
  }

  NewTask.updatedProject = function (e) {
    if(Bkg.DEBUG)
      console.log("NewTask.updatedProject");
    this.updateTaskLists();
    this.updateUsers();
    this.preselectUser();
    trackEvent(Bkg.TASK_FORM, 'Change selected project');
  };

  NewTask.hideDialog = function (e) {
    this.$el.hide();
    $(".new_task").removeClass('currentactivelink');
    //Toggle Notifications panel - show
    this.popupView.showNotifications();
  };

  /**
   * Prepare task data and send to CAWM
   */
  NewTask.submitTask = function (e) {
    e.preventDefault();

    var self = this
      , params = getTaskParams(this.$('form'));

    if ((params.name || "").length === 0) {
      this.$('.errors').show().text("Please enter a title for your task");
      return;
    }
    
    //watchers have to be submitted as array of user ids.
    params.watcher_ids = this.popupView.buildWatchersAsJSonArray();
    
    self.$('input[type=submit]').val("Loading...").attr("disabled", "disabled");

    $.post(localStorage['api_host'] + "/api/2/tasks", params, "json")
      .always(function () {
        self.$('input[type=submit]').val("Create task").removeAttr("disabled");
      })
      .done(this.taskCreated.bind(this))
      .fail(this.taskFailed.bind(this));
  };

  /**
   * Success message after creating a new task
   */
  NewTask.taskCreated = function (data) {
    data = JSON.parse(data);

    // Success message
    var launchUrl = localStorage['api_host'] + '/#!/projects/' + data.project_id +
                    '/tasks/' + data.id;
    var $span = $('<span>').text("Task created: ");
    var hashTaggedTitle = applyHashTags(data.name, launchUrl);
    var $title = $('<span>').html(hashTaggedTitle);
    
    $title.addClass('success');
    
    $span.append($title);
    
    this.$('.errors').html($span);
	
    var string = buildCreatedLinkMain(launchUrl);
	
    this.$('.errors').append(string).show();
    
    // Save params for better next task creation
    Bkg.settings.set('last/project_id', data.project_id);
    Bkg.settings.set('last/project/' + data.project_id + '/task_list_id', data.task_list_id);
    if (Bkg.people.get(data.assigned_id)) {
      Bkg.settings.set('last/user_id', Bkg.people.get(data.assigned_id).get('user_id'));
    }

    trackEvent(Bkg.TASK_FORM, 'Created Task');
    this.resetForm();
  };
  
  NewTask.taskFailed = function (r) {
    this.$('.errors').show().text("Error creating task");
    trackEvent(Bkg.TASK_FORM, 'Failed', JSON.stringify(r));
  };

  /**
   * Preselect the project, either from the user's tb settings or
   * from the last one used successfully in this extension (prioritary)
   */
  NewTask.preselectProject = function () {
    var project_id =
      Bkg.settings.get('last/project_id') ||
      +Bkg.account.get('settings').last_quick_project;

    this.$('select[name=project_id]').val(project_id);
  };

  /**
   * Preselect the project, either from the user's tb settings or
   * from the last one used successfully in this extension (prioritary)
   */
  NewTask.preselectTaskList = function () {
    var project_id = +this.$('select[name=project_id]').val();
    this.$('select[name=task_list_id]').val(
      Bkg.settings.get('last/project/' + project_id + '/task_list_id')
    );
  };

  /**
   * Preselect the user, which will be the last successfully created task
   */
  NewTask.preselectUser = function () {
    var user_id = Bkg.settings.get('last/user_id');

    if (user_id) {
      this.$('select[name=status_and_assigned] option[data-user-id=' + user_id + ']').attr("selected", true);
    }
  };

  /**
   * Update the task list menu according to the selected project
   */
  NewTask.updateTaskLists = function () {
    var $tl_select = this.$('select[name=task_list_id]')
      , project_id = +this.$('select[name=project_id]').val()
      , task_lists = Bkg.task_lists.forProject(project_id);

    $tl_select.empty();
    if (task_lists.length) {
      _(task_lists).each(function (task_list) {
        if (!task_list.get('archived')) {
          $tl_select.append(
            $("<option>").attr('value', task_list.id).text(task_list.get('name'))
          );
        }
      });
    } else {
      $tl_select.append($("<option>").text("[Create a new task list]"));
    }
  };

  /**
   * Update the assigned user and status dropdown
   *
   * The value of each <option> is `status-person`, where person is optional.
   */
  NewTask.updateUsers = function () {
    if(Bkg.DEBUG)
      console.log("NewTask.updateUsers");
    var $select = this.$('select[name=status_and_assigned]')
      , project_id = +this.$('select[name=project_id]').val()
      , $option1 = $("<option>").attr('value', 0).text(Bkg.UNASSIGNED)
      , people = Bkg.people.forProject(project_id)
      , sortedProjectUsers = sortProjectPeople(people);

    //Add sorted project user's collection to view.
    $select.empty().append($option1);      
    sortedProjectUsers.each(function (user) {
      var fullName = user.fullName();
      if(isMe(user.id)) fullName += " (me)";
      
      $select.append($("<option>").attr({
         'value': '1-' + user.get('people_id'),
         'data-user-id': user.id
      }).text(fullName));
    });
    
    //Update users/watchers view with the same kind of list.
    this.popupView.updateWatchersView(project_id);
  };

  NewTask.render = function () {
    if(Bkg.DEBUG)
      console.log("NewTask.render");
    if (this.popupView.neededCollectionsAreLoaded()) {
      this.$el.html(Template(Bkg.TASK_FORM)());
      this.preselectProject();
      this.updateTaskLists();
      this.updateUsers();
      this.preselectTaskList();
      this.preselectUser();
      $(this.el).loadSavedTextareas();
    } else {
      this.$el.html("<p class='message-dialog'>We are still loading your data, please try again.</p>");
      trackEvent(Bkg.TASK_FORM, "Missing collections to load", Bkg.usersession.id);
    }

    return this;
  };

  /**
   * Reset the form inputs for a new task
   */
  NewTask.resetForm = function () {
    this.$('input[name=name], textarea').val("");
    this.$('input[name="task_show_watchers"]').val(Bkg.NOTIFY_ONE_PERSON_LABEL);
    this.popupView.uncheckWatcherCheckboxes();
  	this.popupView.resetInstanceVariables();
  	this.popupView.setFocus("#name");
  };
  
  NewTask.setPopupView = function(popupViewInstance) {
    this.popupView = popupViewInstance;
  };
  
  NewTask.showWatchersList = function(e) {
    if(Bkg.DEBUG)
      console.log("You have clicked watchers list button from task view");
    e.preventDefault();
    this.popupView.hideNewTask();
    this.popupView.showWatchersList(Bkg.TASK_FORM);
  };
  window.Views = window.Views || {};
  window.Views.NewTask = Backbone.View.extend(NewTask);

}());
