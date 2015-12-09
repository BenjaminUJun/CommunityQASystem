Template.posts_list_controller.onCreated(function () {

  var templateInstance = this;
  var terms = _.clone(templateInstance.data.terms);
  templateInstance.terms = terms;

  templateInstance.rTerms = new ReactiveVar(terms);
  templateInstance.rLimit = new ReactiveVar(CQASettings.get('postsPerPage', 10));
  templateInstance.rReady = new ReactiveVar(false);

  var enableToCache = (typeof terms.enableCache === "undefined") ? false : terms.enableCache;
  var CQAsubscriber = enableToCache ? CommunityQA.subsManager : templateInstance;

  var CQAsubscribeToUsers = (typeof terms.subscribeToUsers === "undefined") ? true : terms.subscribeToUsers;

  templateInstance.autorun(function () {

    templateInstance.rReady.set(false);

    var newTermArgu = _.clone(Template.currentData().terms); 

    var rLimitvar = templateInstance.rLimit.get(); 

    newTermArgu.limit = rLimitvar;

    var postingsSubscription = CQAsubscriber.subscribe('postsList', newTermArgu);
    if (CQAsubscribeToUsers) {
      var usersToSubscription = CQAsubscriber.subscribe('postsListUsers', newTermArgu);
    }

    var subscriptionsIsReady;
    if (CQAsubscribeToUsers) {
      subscriptionsIsReady = postingsSubscription.ready() && usersToSubscription.ready(); 
    } else {
      subscriptionsIsReady = postingsSubscription.ready(); 
    }

    if (subscriptionsIsReady) {
      templateInstance.rTerms.set(newTermArgu);
      templateInstance.rReady.set(true);
    }

  });

});

Template.posts_list_controller.onDataChanged(function (data) {

  var templateInstance = this;
  var oldTermArgu = templateInstance.terms;
  var newTermArgu = data.terms;
  
  if (!_.isEqual(oldTermArgu, newTermArgu)) {
    templateInstance.terms = newTermArgu;
    templateInstance.rLimit.set(CQASettings.get('postsPerPage', 10));
  }
});

Template.posts_list_controller.helpers({
  chooseTemplate: function () {
    return !!this.template? this.template: "posts_list";
  },
  data: function () {

    var dataContext = this;

    var templateInstance = Template.instance();

    var terms = templateInstance.rTerms.get(); 
    var postingsReady = templateInstance.rReady.get(); 

    var params = CQAPostings.parameters.get(terms);
    var postingsCursor = CQAPostings.find(params.find, params.options);

    var data = {

      postsCursor: postingsCursor,

      postsReady: postingsReady,

      hasMorePosts: postingsCursor.count() >= terms.limit,

      loadMoreHandler: function (templateInstance) {

        var limits = templateInstance.rLimit.get();
        limits += CQASettings.get('postsPerPage', 10);
        templateInstance.rLimit.set(limits);
      },

      controllerInstance: templateInstance,

      controllerOptions: dataContext.options 

    };

    return data;
  }
});

// Template.user_posts.helpers({
//   arguments: function () {
//     var user = this;
//     return {
//       template: "posts_list_compact",
//       options: {
//         currentUser: user,
//         fieldLabel: i18n.t("postedAt"),
//         fieldValue: function (post) {
//           return moment(post.postedAt).format("MM/DD/YYYY, HH:mm");
//         }
//       },
//       terms: {
//         view: 'userPosts',
//         userId: user._id,
//         limit: 5,
//         enableCache: false,
//         subscribeToUsers: false
//       }
//     };
//   }
// });
