Template.main_posts_list.helpers({
  customTemplate: function () {
    var currentViewForPost = FlowRouter.getQueryParam("view") || CQASettings.get("defaultView", "top");
    var currentMenuItemForPost = _.findWhere(CommunityQA.menuItems.viewsMenu, {name: currentViewForPost});
    return currentMenuItemForPost && currentMenuItemForPost.viewTemplate;
  },
  arguments: function () {
    FlowRouter.watchPathChange();
    var termArgu = _.clone(FlowRouter.current().queryParams);
    termArgu.enableCache = true;

    if (Meteor.userId()) {
      termArgu.userId = Meteor.userId();
    }

    if (!termArgu.view) {
      termArgu.view = CQASettings.get('defaultView', 'top');
    }

    return {
      terms: termArgu,
      options: {
        loadMoreBehavior: CQASettings.get("loadMoreBehavior", "button")
      }
    };
  }
});