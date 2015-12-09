var getViewableMenuItems = function () {
  var defaultItemsOfViewsMenu = CommunityQA.menuItems.get("viewsMenu");

  var viewableItemsOfViewsMenu = _.reject(defaultItemsOfViewsMenu, function (menuItem) {
    return (menuItem.adminOnly && !CQAUsers.is.admin(Meteor.user())) || (!!CQASettings.get('postViews') && !_.contains(CQASettings.get('postViews'), menuItem.name));
  });

  viewableItemsOfViewsMenu = _.map(viewableItemsOfViewsMenu, function (menuItem) {
    menuItem.itemClass = "view-"+menuItem.name;
    return menuItem;
  });

  return viewableItemsOfViewsMenu; 
};

Template.views_menu.helpers({
  menuLabel: function () {
    return trans.t("view");
  },
  menuItems: function () {
    return getViewableMenuItems();
  }
});
