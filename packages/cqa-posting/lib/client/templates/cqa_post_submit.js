// Global Subscriptions in the core lib

//Telescope.subsManager = new SubsManager({
  // cache recent 50 subscriptions
  //cacheLimit: 50,
  // expire any subscription after 30 minutes
  //expireIn: 30
//});

Template.post_submit.onCreated(function () {
  CommunityQA.subsManager.subscribe('allUsersAdmin');
});

Template.post_submit.helpers({
  postFields: function () {
    var currentUser = Meteor.user();
    return CQAPostings.simpleSchema().getEditableFields(currentUser);
  }
});

AutoForm.hooks({
  submitPostForm: {

    before: {
      method: function(doc) {

        var postItem = doc;
        var templateInstance = this.template;
        templateInstance.$('button[type=submit]').addClass('loading');
        templateInstance.$('input, textarea').not(":disabled").addClass("disabled").prop("disabled", true);

        if (!Meteor.user()) {
          CQAMessages.flash(trans.t('you_must_be_logged_in'), 'error');
          return false;
        }

        postItem = CommunityQA.callbacks.run("postSubmitClient", postItem);

        return postItem;
      }
    },

    onSuccess: function(operation, post) {
      Events.track("new post", {'CQApostId': post._id});
      var templateOnSuc = this.template;
      CommunityQA.subsManager.subscribe('singlePost', post._id, function () {
        templateOnSuc.$('button[type=submit]').removeClass('loading');
        FlowRouter.go('postPage', post);
      });
    },

    onError: function(operation, error) {
      var templateOnErr = this.template;
      templateOnErr.$('button[type=submit]').removeClass('loading');
      templateOnErr.$('.disabled').removeClass("disabled").prop("disabled", false);

      CQAMessages.flash(error.message.split('|')[0], 'error'); 
      CQAMessages.clearSeen();
      if (error.error === "603") {
        var dupePostingsId = error.reason.split('|')[1];
        FlowRouter.go('postPage', {slug: '_', _id: dupePostingsId});
      }
    }

  }
});
