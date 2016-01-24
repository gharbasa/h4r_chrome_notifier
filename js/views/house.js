
/*global Bkg*/
(function () {

  var House = {
    className: 'house'
  };

  House.events = {
    'click .js-dismiss' : 'dismissHouse'
  };

  /**
   * Remove from the collection, and mark as read in the server
   */
House.dismissHouse = function (e) {
  e.preventDefault();
  this.model.markAsRead();
  Bkg.houses.remove(this.model);
  trackEvent("house", "Dismiss");
};

//Will buld img tag with the appropriate avatar image.
function buildAvatar(user) {
  var $imgDiv = null; 
  if(user) {
    var $img = $("<img class='transitionavatar'>");
    $img.attr('src', user? user.get('micro_avatar_url') : "");
    $img.attr('alt', user? user.fullName() : "");
    $imgDiv = $("<div class='divtransitionavatar'>");
    $imgDiv.html($img);
  }
  else
  {
  	$imgDiv = $("<div class='unknown_avatar'>");
  	$img = $("<i class='icon-user-1'>");
  	$imgDiv.html($img);
  }
  return $imgDiv; 
}

//Build user name to display beside avatar
function buildUserLabel(user, assigned_id) {
  var $div = $("<div class='transitionuserlabel'>");
  var textContent = "";
  if(user)
    textContent = user.fullName();
  else if(assigned_id)
    textContent = Bkg.UNKNOWN_USER; //This happens if the user account is disabled/removed.
  else textContent = Bkg.UNASSIGNED;
  
  $div.text(textContent);
  return $div;
}

//Render status of the task, if its 1-open render avatar
function renderStatus(s, assigned_id, position) {
  var $mainDiv = $("<span>"), person, user,$img;
    
  if (s === Bkg.TASK_STATUS_SYM.NOT_STARTED || s === Bkg.TASK_STATUS_SYM.NEW) {
    person = Bkg.people.get(assigned_id);
    if(person)
      user = Bkg.users.get(person.get('user_id'));
    if(position === 'left') {
      $mainDiv.addClass("left");
    }
    else {
      $mainDiv.addClass("transitioneduser");
    }
    var $avatarDiv = buildAvatar(user);
    var $userLabelDiv = buildUserLabel(user, assigned_id);
    $mainDiv.html($avatarDiv);
    $mainDiv.append($userLabelDiv);
  }
  else {
    $mainDiv.addClass("label");
    if(position === 'left') $mainDiv.addClass("left");
    $mainDiv.addClass("status");
    $mainDiv.addClass("status_" + s);
    $mainDiv.text(Bkg.status_names[s]);
  }
  return $mainDiv;
}

/*Due date format in the web ui is different, Aug 22, but not 2014-08-22
 * And Today, Tomorrow, Yesterday.
 */
function renderDueDate(date, position) {
  if(Bkg.DEBUG) console.log("Due Date to format and render is:" + date);
  var $mainDiv = $("<span>"), person, user,$img;
  if (date) {
    if(position === 'left') {
      $mainDiv.addClass("left");
    }
    var date_human_format = dateFormat(date);
    $mainDiv.text(date_human_format);
  }
  else {
    
    if(position === 'left') $mainDiv.addClass("left");
    
    $mainDiv.text(Bkg.NO_DUE_DATE);
  }
  return $mainDiv;
}

function renderUrgent(position) {
  var $mainDiv = $("<span>");
  $mainDiv.addClass("label");
  if(position === 'left')  $mainDiv.addClass("left");
  $mainDiv.addClass("urgent");
  $mainDiv.text(Bkg.URGENT);  
  return $mainDiv;
}
  
function renderUser(assigned_id, position) {
  var $mainDiv = $("<span>"), person, user,$img;
  
  if (person = Bkg.people.get(assigned_id)) {
    user = Bkg.users.get(person.get('user_id'));
    if(position === 'left') {
      $mainDiv.addClass("left");
    }
    else {
      $mainDiv.addClass("transitioneduser");
    }
      
    var $avatarDiv = buildAvatar(user);
    var $userLabelDiv = buildUserLabel(user, assigned_id);
    $mainDiv.html($avatarDiv);
    $mainDiv.append($userLabelDiv);
  }
  else { //mark it as Unassigned
    if(position === 'left') {
      $mainDiv.addClass("left");
    }
    else {
      $mainDiv.addClass("transitioneduser");
    }
    
    var $avatarDiv = buildAvatar(null);
    var $userLabelDiv = buildUserLabel(null, assigned_id);
    $mainDiv.html($avatarDiv);
    $mainDiv.append($userLabelDiv);
  }
  return $mainDiv;
}
  
  /*
  "assigned_id":null,"previous_assigned_id":null,
  "status":3,"previous_status":0,
  "due_on":null,"previous_due_on":null,
  "is_private":false,"previous_is_private":null,
  "urgent":false,"previous_urgent":false
  */
 
  function renderTransitions(comment) {
    if(Bkg.DEBUG) console.log("House comment...:" + JSON.stringify(comment));
    var outerHTML = "";
    var $transitions = $("<div class='transition'>");
    if(comment.assigned_id !== comment.previous_assigned_id) {
      //Status might not have changed, but might have assigned to different user
      if(Bkg.DEBUG) console.log("Issue is tranferred from one user to other");
      $transitions
        .append(renderUser(comment.previous_assigned_id, 'left'))
        .append(Bkg.TRANSITION_SYM)
        .append(renderUser(comment.assigned_id, 'right'));
        outerHTML = $transitions[0].outerHTML;
    }
    else if (comment.status !== comment.previous_status) {
      $transitions
        .append(renderStatus(comment.previous_status, comment.previous_assigned_id, 'left'))
        .append(Bkg.TRANSITION_SYM)
        .append(renderStatus(comment.status, comment.assigned_id, 'right'));
      outerHTML = $transitions[0].outerHTML; 
    } else if(comment.urgent !== comment.previous_urgent) {
      //Task is an urgent one, lets mark it as urgent here.
      if(Bkg.DEBUG) console.log("Urgency is changed");
      if(comment.urgent === true) {
      	$transitions
        .append(renderDueDate(comment.previous_due_on, 'left'))
        .append(Bkg.TRANSITION_SYM)
        .append(renderUrgent('right'));
      } else if(comment.previous_urgent === true) {
      	$transitions
        .append(renderUrgent('left'))
        .append(Bkg.TRANSITION_SYM)
        .append(renderDueDate(comment.due_on, 'right'));
      }
      outerHTML = $transitions[0].outerHTML;
    } else if(comment.due_on !== comment.previous_due_on) {
      //Due date is changed
      if(Bkg.DEBUG) console.log("Due date is changed");
      $transitions
      .append(renderDueDate(comment.previous_due_on, 'left'))
      .append(Bkg.TRANSITION_SYM)
      .append(renderDueDate(comment.due_on, 'right'));
      outerHTML = $transitions[0].outerHTML;
    }
    else { //Check if hours and time_tracking_at attributes are set
      if(comment.hours) {
        if(Bkg.DEBUG) console.log("comment.hours=" + comment.hours + ", comment.time_tracking_at=" + comment.time_tracking_at);
        $transitions
        .append(timeSlice(comment.hours) + " - " + dateFormat(comment.time_tracking_at));
        outerHTML = $transitions[0].outerHTML;
      }
    }
    return outerHTML;
  }

  // Exposing so it can be used from jade
  window.renderTransitions = renderTransitions;

  function renderIcon(type) {
    if(Bkg.DEBUG) console.log("renderIcon::House type:" + type);
    $img = $("<i>");
    if(type === 'Conversation') {
  	  $img.addClass('icon-comment');
    }
    else if(type ==='Task') {
      $img.addClass('icon-check');
    }
    return $img[0].outerHTML;
  }
  
  window.renderIcon = renderIcon;
  
  function renderUpdatedAt(comment) {
    if(Bkg.DEBUG) console.log("renderUpdatedAt::House updated at:" + comment.updated_at);
    $img = $("<label>");
    var label = dateFormatUpdatedAt(comment.updated_at);
    $img.text(label);
    return $img[0].outerHTML;
  }
  
  window.renderUpdatedAt = renderUpdatedAt;
  
  /**
   * Render house
   */
  House.render = function () {
    //var target = this.model.get('target') || {};
    this.$el
      .attr({ 'id': this.model.id })
      .html(Template('house')({
        model: this.model
      }));

    // TODO: Show privacy icon

    return this;
  };

  window.Views = window.Views || {};
  window.Views.House = Backbone.View.extend(House);

}());
