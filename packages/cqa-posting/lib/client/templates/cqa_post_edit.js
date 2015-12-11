Template.post_edit.onCreated(function () {

  var currentTemplateInstance = this;

  currentTemplateInstance.ready = new ReactiveVar(false);

  var postingsSubscription = CommunityQA.subsManager.subscribe('singlePost', FlowRouter.getParam("_id"));
  
  currentTemplateInstance.autorun(function () {

    var subscriptionsisReady = postingsSubscription.ready(); 

    if (subscriptionsisReady) {
      currentTemplateInstance.ready.set(true);
    }
  });

});

Template.post_edit.helpers({
  ready: function () {
    return Template.instance().ready.get();
  },
  post: function () {
    return CQAPostings.findOne(FlowRouter.getParam("_id"));
  },
  postFields: function () {
    var currentUser = Meteor.user();
    return CQAPostings.simpleSchema().getEditableFields(currentUser);
  }
});

AutoForm.hooks({
  editPostForm: {

    before: {
      "method-update": function() {
        
        var postDoc = this.currentDoc;
        var modifierToDoc = this.updateDoc;
        var currentUser = Meteor.user();

        if (!currentUser {
          CQAMessages.flash(trans.t('you_must_be_logged_in'), "");
          return false;
        }

        modifierToDoc = CommunityQA.callbacks.run("postEditClient", modifierToDoc, postDoc);
        return modifierToDoc;
      }
    },

    onSuccess: function(formType, post) {
      CQAEventings.track("edit post", {'CQApostId': post._id});
      FlowRouter.go('postPage', post);
    },

    onError: function(formType, error) {
      console.log(error);
      CQAMessages.flash(error.reason.split('|')[0], "error"); // workaround because error.details returns undefined
      CQAMessages.clearSeen();
    }

  }
});