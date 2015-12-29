/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

(function () {

  var Projects = {};

  Projects.url = function () {
    return window.Bkg.settings.apiHost + "/api/2/projects?count=0";
  };

  Projects.comparator = function (project) {
    return project.get('name').toLowerCase();
  };

  window.Collections = window.Collections || {};
  window.Collections.Projects = Backbone.Collection.extend(Projects);

}());
