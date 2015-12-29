
(function () {

  var Notifications = {};

  Notifications.initialize = function () {
    this.collection.on('remove', this.hideNotification, this);
  };

  /**
   * Show notifications or a primer screen, saying they aren't in yet
   */
  Notifications.render = function () {
    var self = this;

    this.collection.each(function (notification) {
      var view = new Views.Notification({ model: notification });
      self.$el.append(view.render().el);
    });

    this.showPrimerIfEmpty();

    return this;
  };

  Notifications.showPrimerIfEmpty = function () {
    this.$('.no-notifications').remove();

    if (!this.collection.length) {
      this.$el.append(Template('no_notifications')());
    }
  };

  Notifications.hideNotification = function (m) {
    // Possible memory leak because we aren't deleting the view?
    this.$("#" + m.get('identifier')).remove();
    this.showPrimerIfEmpty();
  };

  window.Views = window.Views || {};
  window.Views.Notifications = Backbone.View.extend(Notifications);

}());
