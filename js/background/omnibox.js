/**
 * Search using Chrome's Omnibox
 */
(function () {

  chrome.omnibox.setDefaultSuggestion({ description: 'Search in H4R' });

  function suggestionFromResult(r) {
    var project = Bkg.projects.get(r.project_id)
      , desc = r.name.replace(/[<>]/g, "");

    // Add project name with defensive coding, in case we don't have it yet
    if (project) {
      desc = '<dim>' + project.get('name').replace(/[<>]/g, "") + ':</dim> ' + '<match>' + desc + '</match> ' + r.type;
    }

    return {
      content: Bkg.settings.apiHost + "/#!/projects/" + r.project_id + "/" + r.type.toLowerCase() + "s/" + r.id,
      description: desc
    };
  }

  /**
   * Populate search suggestions from API results
   */
  function populateSuggestions(results, suggest) {
    suggest(
      _(results).select(function (r) { return r.name; }).map(suggestionFromResult)
    );
  }

  /**
   * This event is fired each time the user updates the text in the omnibox
   */
  chrome.omnibox.onInputChanged.addListener(
    function(text, suggest) {
      if (navigator.onLine) {
        //suggest([{ content: '', description: 'Searching in CA Work Management...' }]);
        $.getJSON(Bkg.settings.apiHost + '/api/2/search?q=' + encodeURIComponent(text), function (data) {
          populateSuggestions((data.results || []).slice(0,6), suggest);
        });
      }
    }
  );

  /**
   * Open CA Work Management search results (for search) or the requested page
   */
  chrome.omnibox.onInputEntered.addListener(
    function (text) {
      if (!navigator.onLine) {
        alert("Searching CA Work Management requires an internet connection");
        return;
      }

      var url;
      if (text.match(/#!/)) {
        trackEvent('omnibox', 'Open CA Work Management element');
        url = text;
      } else {
        trackEvent('omnibox', 'Open CA Work Management search');
        url = Bkg.settings.apiHost + '/#!/search?query=' + encodeURIComponent(text);
      }
      window.open(url, '_blank');
      window.focus();
    }
  );

}());
