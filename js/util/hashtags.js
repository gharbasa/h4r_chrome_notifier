/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
 * This is pickedup from frontend app
 * 	Frame work changes were made to fit in Notifier framework	
 *  _.trim() function doesn't exists in the version of underscore that Notifier is using, 
 * 	   I had to modify tokenize function here to make it work.
*/

var Hashtags = function() {

  var Hashtags = {}
    , parseFront
    , parseBack;

  function isHash(str) {
    return str.match(/^#[^#\s<>]+$/);
  }

  function tokenize(str) {
    return _.compact(str.trim().split(' '));
  }

  function normalizeTag(tag) {
    return tag.slice(1);
  }

  parseFront = _.memoize(function (tokens) {
    var i = 0, results = [];

    for (;i < tokens.length; i++) {
      if (isHash(tokens[i])) {
        results.push(normalizeTag(tokens[i]));
      } else {
        return results;
      }
    }

    return results;
  });

  parseBack = _.memoize(function (tokens) {
    var i = tokens.length - 1, results = [];

    for (;i > 0; i--) {
      if (isHash(tokens[i])) {
        results.unshift(normalizeTag(tokens[i]));
      } else {
        return results;
      }
    }

    return results;
  });

  /**
   * Extracts the hashtags on a given string
   *
   * @param {String} str
   * @return {Array<String>}
   */
  this.extract = _.memoize(function (str) {
    if (!str || str.indexOf('#') === -1) {
      return [];
    }

    var tokens = tokenize(str);

    return _.uniq(parseFront(tokens).concat(parseBack(tokens)));
  });

  /**
   * Returns the string without the hashtags
   *
   * @param {String} str
   * @return {String}
   */
  this.strip = function (str) {
    var tokens = tokenize(str)
      , front_hashtags = parseFront(tokens)
      , back_hashtags = parseBack(tokens);

    _.each(front_hashtags, function (tag) {
      str = str.replace('#' + tag + ' ', '');
    });

    _.each(back_hashtags, function (tag) {
      str = str.replace(' #' + tag, '');
    });

    return str;
  };
};
