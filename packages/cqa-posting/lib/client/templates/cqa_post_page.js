var doingSEOStuff = function (postItem) {

  //this is a bug needed to fix;
  var hrefForLink = postItem.getPageUrl(true);

  var linkForPost = {rel: "canonical", href: hrefForLink};

  DocHead.addLink(linkForPost);

  var sitePropertyAndContent = {property: "og:site_name", content: CQASettings.get("title")};

  DocHead.addMeta(sitePropertyAndContent);

  CommunityQA.SEO.setTitle(postItem.title);

  if (!!postItem.body) {
    var descriptionOfThePost = CommunityQA.utils.trimWords(postItem.body, 100);
    CommunityQA.SEO.setDescription(descriptionOfThePost);
  }

  if (!!postItem.thumbnailUrl) {
    var imageForThePost = CommunityQA.utils.addHttp(postItem.thumbnailUrl);
    var twitterPropertyAndContent = {property: "twitter:card", content: "summary_large_image"};
    DocHead.addMeta(twitterPropertyAndContent);
    CommunityQA.SEO.setImage(imageForThePost);
  }

  if (!!CQASettings.get("twitterAccount")) {
    var twittersitePropertyAndContent = {property: "twitter:site", content: CQASettings.get("twitterAccount")};
    DocHead.addMeta(twittersitePropertyAndContent);
  }
  
};

Template.post_page.onCreated(function () {

  var currentTemplate = this;
  var postById = FlowRouter.getParam("_id");

  currentTemplate.ready = new ReactiveVar(false);

  var subscriptionOfPost = CommunityQA.subsManager.subscribe('singlePost', postById);
  var postUsersSubscription = CommunityQA.subsManager.subscribe('postUsers', postById);
  var commentSubscription = CommunityQA.subsManager.subscribe('commentsList', {view: 'postComments', CQApostId: postById});
  
  currentTemplate.autorun(function () {

    var subscriptionsIsReady = subscriptionOfPost.ready(); 

    if (subscriptionsIsReady) {
      currentTemplate.ready.set(true);
      var postItem = CQAPostings.findOne(FlowRouter.getParam("_id"));
      if (postItem) {
        doingSEOStuff(postItem);
      } else {
        DocHead.addMeta({
          name: "name",
          property: "prerender-status-code",
          content: "404"
        });
        DocHead.addMeta({
          name: "name",
          property: "robots",
          content: "noindex, nofollow"
        });
      }
    }
  });

});

Template.post_page.helpers({
  ready: function () {
    return Template.instance().ready.get();
  },
  postItem: function () {
    return CQAPostings.findOne(FlowRouter.getParam("_id"));
  },
  canWatch: function () {
    var postItem = this;
    var currentUser = Meteor.user();
    if (postItem.status === CQAPostings.config.STATUS_PENDING && !CQAUsers.can.viewPendingPost(currentUser, postItem)) {
      return false;
    } else if (postItem.status === CQAPostings.config.STATUS_REJECTED && !CQAUsers.can.viewRejectedPost(currentUser, postItem)) {
      return false;
    }
    return true;
  },
  atPending: function () {
    var postItem = this;
    return postItem.status === CQAPostings.config.STATUS_PENDING;
  }
});

Template.post_page.rendered = function(){
  $('body').scrollTop(0);
};
