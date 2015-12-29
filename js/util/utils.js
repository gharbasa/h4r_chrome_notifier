/*
 * Copyright (c) 2014, CA Inc.  All rights reserved.
*/


/*
 * commonly used functions are defined here.
 */

/*This function is used in users view and new_task view
 *   to sort project people before displaying them for selection in watchers view and in assignee dropdown
 */
function sortProjectPeople(people) {
  //Build the collection and sort
  var userCollection = new Collections.Users;
  var cv = 0;
  var projectUsers = new Array();
  _(people).each(function (person) {
    var user = Bkg.users.get(person.get('user_id'));
    if(user) { //Strange, user model is undefined for some of the project people
      user.set('people_id', person.id); //preserve the people primary key record id, used by new_task view.
      projectUsers[cv++] = user.attributes;
    }
  });
  
  userCollection.add(projectUsers); //Sorting happens while adding model to collection
  return userCollection; 
}

//This function is used in user view and new_task view to check if the current user model instance is a login user
function isMe (userId) {
  return (parseInt(userId) === Bkg.account.get('id'));
}

// Exposing it in window scope, so it can be used from jade
window.isMe = isMe;



//This function is called from new_task.js and new_conversation.js
function buildCreatedLinkMain (linkURL) {
  if(Bkg.DEBUG)
    console.log("Popup.buildCreatedLinkParentTab");
  var string = buildCreatedLink(linkURL);
  string = "<div class='created_url_display'>" + string + "</div>";
  return string;
};
  
//OnClick on the link(span tag), Replace link span tag with readonly textbox
function buildCreatedLink (linkURL) {
  if(Bkg.DEBUG)
    console.log("Popup.buildCreatedLink:" + linkURL);
  var string = "<span class='created_task_conv_link'>" + linkURL + "</span>";
  return string;
};
  
function buildLinkTextbox (textContent) {
  if(Bkg.DEBUG)
    console.log("Popup.buildLinkTextbox:" + textContent);
  var $input = $('<input>');
  $input.addClass('created_url_input');
  $input.val(textContent);
  $input.attr('id', 'created_task_conv_link_textbox');
  $input.attr('readonly', 'true');
  return $input;
};

/*
 * Following function applies hashtag to token like #&Notifier, ##Notifier, &#Notifier
 */
/*
function renderTitle(title) {
  console.log("renderTitle, Title=" + title);
  var span = "<span>";
  title = _.escape(title); //xss
  console.log("renderTitle, after escape chars Title=" + title);
  //var hashTagPattern = /\s*#(\S+)/g; //0 or more spaces followed by # followed by 1 or more non-space character
  var hashTagPattern = /^#([^\s<>]+)/g; //0 or more spaces followed by # followed by 1 or more non-space character
  var hashtags = title.match(hashTagPattern);
  if(hashtags) {
    if(Bkg.DEBUG) console.log("Hashtags length=" + hashtags.length);
    for(var i=0; i<hashtags.length; i++) {
      var hashtag = hashtags[i].replace(/#/, "");
      if(Bkg.DEBUG) console.log("Hashtags[" + i + "]=" + hashtags[i] + ", hashtag=" + hashtag);
      var hashLabel = "<span class='hashtag'>" + hashtag + "</span>" + " ";
      title = title.replace(hashtags[i], hashLabel);
    }
  }
  span += title + "</span>";
  return span;
}
*/

/*
 * Following function makes use of hashtags.js
 * 	This function is used by Notification window to display task/conversation title
 * 		New Task/New Conversation forms (confirmation message showing- successfully created)
 * 	When you make changes to this function, you have to test 3 places as mentioned above.
 */

function applyHashTags(title, targetURL) {
  var finalTitle = "";
  if(Bkg.DEBUG) console.log("renderTitle, Title=" + title);
  title = _.escape(title); //xss
    
  var hashTagObj = new Hashtags();
  var titleNoHashes = hashTagObj.strip(title);
  var hashTags = hashTagObj.extract(title);
  
  for(var i=0; i<hashTags.length; i++) {
      var hashtag = hashTags[i];
      var hashTagURL = localStorage['api_host'] + "/a/#!/search?query=" + encodeURIComponent("#" + hashtag); 
      var hashLabel = "<a href='" + hashTagURL + "' class='hashtag'>" + hashtag + "</a>" + " ";
      finalTitle += hashLabel;
  }
  
  var noHashTitleLink = "<a href='" + targetURL + "' class='noHashtag'>" + titleNoHashes + "</a>" + " ";
  finalTitle += noHashTitleLink;
  return finalTitle;
}
window.applyHashTags = applyHashTags;

