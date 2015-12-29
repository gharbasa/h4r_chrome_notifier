/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/

/**
 * Following content will be injected to the current webpage in the curren tab.
 * If you have to watch console messages, 
 * set the DEBUG flag to true and then you have to watch messages in the main tab javascript console 
 */

var DEBUG = false;
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if(request.method === "getText"){
      if(DEBUG) console.log("Received getText message from the app.");
      html = getSelectionHtml();
      sendResponse({data: html, method: "getText"}); //same as innerText
    }
  }
);

/**
 * Capture the content that the user had selected.
 */
function getSelectionHtml() {
  var html = "";
  if(DEBUG) console.log("In the beginning of getSelectionHtml:" + window.location.href);
  if (typeof window.getSelection != "undefined") {
    var sel = window.getSelection();
    if (sel.rangeCount) {
      var container = document.createElement("div"); //here, we are creating div, but not appending it to the body.
      for (var i = 0, len = sel.rangeCount; i < len; ++i) {
        container.appendChild(sel.getRangeAt(i).cloneContents());
      }
      //Bydefault if the href has relative URL, container.innerHTML doesn't resolve to the absolute URL.
      //Following simple technique resolved the issue.
      
      var anchorArray = container.getElementsByTagName("a");
      if(anchorArray != undefined)
      {
        for(var i=0; i<anchorArray.length; i++)
        {
      	  var anchorTag = anchorArray[i];
      	  anchorTag.href = "" + anchorTag.href;
        }
      }
      
      html = container.innerHTML;
    }
  }else if (typeof document.selection !== "undefined") {
    if (document.selection.type === "Text") {
      html = document.selection.createRange().htmlText;
    }
  }
  if(DEBUG) console.log("Content to send:" + html);
  return html;
}