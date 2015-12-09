Template.main_posts_list.helpers({
  customTemplate: function () {
    var currentView = FlowRouter.getQueryParam("view") || Settings.get("defaultView", "top");
    var currentMenuItem = _.findWhere(CommunityQA.menuItems.viewsMenu, {name: currentView});
    return currentMenuItem && currentMenuItem.viewTemplate;
  },
  arguments: function () {
    FlowRouter.watchPathChange();
    var terms = _.clone(FlowRouter.current().queryParams);
    terms.enableCache = true;

    // if user is logged in, add their id to terms
    if (Meteor.userId()) {
      terms.userId = Meteor.userId();
    }

    if (!terms.view) {
      terms.view = CQASettings.get('defaultView', 'top');
    }

    return {
      terms: terms,
      options: {
        loadMoreBehavior: CQASettings.get("loadMoreBehavior", "button")
      }
    };
  }
});