
/*
 * If you require to see console messages
 * 	set Bkg.DEBUG to true in background/init.js file, reload the extension in develper mode from your local file system
 * 	Click on the cawm icon from toolbar and then mouse rightclick, inspect element
 * 		This will open the javascript console window
 */
window.Bkg = chrome.extension.getBackgroundPage().Bkg;

$(function () {
  var view = null;
  view = new Views.Popup();
  $("#content").append(view.render().el);
  /*
  if (Bkg.usersession.isLoggedIn()) {
    view = new Views.Popup();
    $("#content").append(view.render().el);
  } else {
    view = new Views.Login();
	$("#content").append(view.render().el);
	//alert("Provide login screen here");
	
	  
	//$("#content").append(Template('logged_out')());
    //Bkg.refresh();
    //trackEvent("not_logged_in", "Not logged in");
    
	
  }
  */
  //Insert content script in the current tab. This script is defined as content script in manifest file.
  if(Bkg.DEBUG) console.log("Bkg.fromContextMenu=" + Bkg.fromContextMenu);
  //if(Bkg.fromContextMenu === -1) //-1 means popup is not launched from contextmenu right click, instead its a regular launch
  if (Bkg.usersession.isLoggedIn())
  {
    Bkg.tabTitle = "";
    Bkg.tabUrl = "";
    Bkg.tabContent = ""; //getText event from content script will populate this value.
      
    //Read tab title and tab url.
    if(Bkg.DEBUG) console.log("Querying active tab for tab attributes");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if(Bkg.DEBUG) console.log("tab details from query response :" + JSON.stringify(tabs));//selectedId = tabs[0].id;
      Bkg.tabTitle = tabs[0].title;
      Bkg.tabUrl = tabs[0].url;
      Bkg.tabContent = ""; //getText event from content script will populate this value.
      //Read selected content from the current tab.
      if(Bkg.tabUrl !== Bkg.CHROME_EXTENSION_PAGEURL && Bkg.tabUrl !== Bkg.CHROME_BLANK_TAB) //Do not inject to extensions/settings page 
      {
        if(Bkg.DEBUG) console.log("Injecting script to active tab");
        chrome.tabs.executeScript(null, {file: "js/content_script.js"}, function(content) {
          if(Bkg.DEBUG) console.log("response after injecting content script:" + JSON.stringify(content));//selectedId = tabs[0].id;
          if(Bkg.DEBUG) console.log("querying selected content from the active tab.");
          chrome.tabs.sendRequest(tabs[0].id, {method: "getText"}, function(response) {
            if(Bkg.DEBUG) console.log("Response received from the content script:" + JSON.stringify(response));
            if (response.method === "getText") {
              var selContent = response.data;
              if(Bkg.tabContent != null && Bkg.tabContent !="")
                Bkg.tabContent += "\n\n";
              Bkg.tabContent += selContent; //Support for multi-selection across frames, but frame support is not working.
              if(Bkg.DEBUG) console.log("selected content=" + Bkg.tabContent);
            }
          });	
        });
      }
      else
      {
      	if(Bkg.DEBUG) console.log("Its a chrome extension page, can not inject content script.");
      }
    });
  }
  
  if(view != null) {
    if(Bkg.DEBUG) console.log("View is not null, means session exists.");
    //view.setFocus();
  }
  //Following 2 variables have to be set to after view.setFocus(); function is called.
  //reset the 2 variables after popup is loaded.   
  /*
  Bkg.fromContextMenu = -1;
  Bkg.selectedContextMenuId = "";
  */
  
});
