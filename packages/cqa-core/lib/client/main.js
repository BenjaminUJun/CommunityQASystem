Session.set('appIsReady', false);

Meteor.startup(function () {
  var linkings = {rel: "alternate", type: "application/rss+xml", href: "/feed.xml", title: trans.t("new_posts")};
  DocHead.addLink(linkings);
});

CommunityQA.subsManager = new SubsManager({
  cacheLimit: 50,
  expireIn: 30
});