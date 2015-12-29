/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

(function () {

  var TaskLists = {};

  TaskLists.url = function () {
    return window.Bkg.settings.apiHost + "/api/2/task_lists?count=0";
  };

  TaskLists.comparator = function (task_list) {
    return -task_list.get('position');
  };

  /**
   * Get unarchived task lists for a project
   */
  TaskLists.forProject = function (project_id) {
    var task_lists = this.select(function (task_list) {
      return task_list.get('project_id') === project_id &&
             task_list.get('archived') === false;
    });

    return task_lists;
  };

  window.Collections = window.Collections || {};
  window.Collections.TaskLists = Backbone.Collection.extend(TaskLists);

}());
