/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

(function () {

  var People = {};

  People.url = function () {
    return window.Bkg.settings.apiHost + "/api/2/people?count=0";
  };

  People.forProject = function (project_id) {
    return this.select(function (person) {
      return person.get('project_id') == project_id;
    });
  };

  window.Collections = window.Collections || {};
  window.Collections.People = Backbone.Collection.extend(People);

}());
