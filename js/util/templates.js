/**
 * Defined Template(), which gives you a precompiled version of your template.
 */

(function () {

  if (!window.templates) {
    alert("Jade templates aren't loaded, because the compiled/templates.js is missing or not loaded. Read the README.");
  }

  window.Template = _.memoize(function (name) {
    if (!window.templates[name]) {
      alert("Couldn't load template " + name);
    }

    return jade.compile(window.templates[name]);
  });

}());
