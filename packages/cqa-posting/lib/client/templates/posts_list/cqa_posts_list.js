Template.posts_list.onCreated(function() {
  Session.set('listPopulatedAt', new Date());
});

Template.posts_list.helpers({
  postingsLayout: function () {
    return CQASettings.get('postsLayout', 'posts-list');
  },
  description: function () {
    var controllerForIron = Iron.controller();
    if (typeof controllerForIron.getDescription === 'function')
      return Iron.controller().getDescription();
  },
  postsCursor : function () {
    if (this.postsCursor) {
      var postings = this.postsCursor.map(function (postItem, index) {
        postItem.rank = index;
        return postItem;
      });
      return postings;
    } else {
      console.log('postsCursor not defined');
    }
  }
});

Template.postsListIncoming.events({
  'click .show-new': function() {
    Session.set('listPopulatedAt', new Date());
  }
});

Template.postsLoadMore.helpers({
  postsReady: function () {
    return this.postsReady;
  },
  showScrollByInfinite: function () {
    if (this.controllerOptions && this.controllerOptions.loadMoreBehavior === "button") {
      return false;
    } else {
      return this.hasMorePosts;
    }
  },
  showLoadingMoreButton: function () {
    if (this.controllerOptions && this.controllerOptions.loadMoreBehavior === "scroll") {
      return false;
    } else {
      return this.hasMorePosts;
    }
  },
  hasPostings: function () {
    return !!this.postsCursor.count();
  }
});

Template.postsLoadMore.onCreated(function () {

  var dataContext = Template.currentData();

  if (dataContext.controllerOptions && dataContext.controllerOptions.loadMoreBehavior === "scroll") {

    $(window).scroll(function() {
      if($(window).scrollTop() + $(window).height() === $(document).height()) {
        dataContext.loadMoreHandler(dataContext.controllerInstance);
      }
    });

  }
});

Template.postsLoadMore.events({
  'click .more-button': function (event) {
    event.preventDefault();
    this.loadMoreHandler(this.controllerInstance);
  }
});

    /*var data = {

      // posts cursor
      postsCursor: postsCursor,

      // posts subscription readiness, used to show spinner
      postsReady: postsReady,

      // whether to show the load more button or not
      hasMorePosts: postsCursor.count() >= terms.limit,

      // what to do when user clicks "load more"
      loadMoreHandler: function (template) {
        // increase limit by 5 and update it
        var limit = template.rLimit.get();
        limit += Settings.get('postsPerPage', 10);
        template.rLimit.set(limit);
      },

      // the current instance
      controllerInstance: template,

      controllerOptions: context.options // pass any options on to the template

    };*/
