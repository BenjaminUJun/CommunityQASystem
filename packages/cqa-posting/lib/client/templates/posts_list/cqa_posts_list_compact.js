Template.posts_list_compact.helpers({
  postsCursor: function () {
    if (this.postsCursor) { 
      var postings = this.postsCursor.map(function (postItem, index) {
        postItem.rank = index;
        return postItem;
      });
      return postings;
    } else {
      console.log('postsCursor not defined');
    }
  },
  labelOfField: function () {
    var getFieldLabel = this.controllerOptions.fieldLabel;
    return getFieldLabel;
  },
  valueOfField: function () {
    var controllerOptionsForField = Template.parentData(3).data.controllerOptions;
    return controllerOptionsForField.fieldValue(this);
  }
});

Template.posts_list_compact.events({
  'click .more-button': function (event) {
    event.preventDefault();
    if (this.controllerInstance) {
      this.loadMoreHandler(this.controllerInstance);
    } else {
      this.loadMoreHandler();
    }
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