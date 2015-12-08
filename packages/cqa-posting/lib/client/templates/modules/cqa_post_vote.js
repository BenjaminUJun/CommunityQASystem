Template.post_vote.helpers({
  enableUserToDownvotes: function () {
    return CQASettings.get("enableDownvotes", false);
  },
  actionsClassForTemplate: function () {
    var currentUser = Meteor.user();
    var getActionClass = "";
    var postItem = this;
    if(!currentUser) return false;
    if (currentUser.hasUpvoted(postItem)) {
      getActionClass += " voted upvoted";
    }
    if (currentUser.hasDownvoted(postItem)) {
      getActionClass += " voted downvoted";
    }
    if (CQASettings.get("enableDownvotes", false)) {
      getActionClass += " downvotes-enabled";
    }
    return getActionClass;
  }
});

Template.post_vote.events({
  'click .upvote-link': function(e){
    var postItem = this;
    var currentUser = Meteor.user();
    e.preventDefault();
    if(!currentUser){
      FlowRouter.go('signIn');
      Messages.flash(i18n.t("please_log_in_first"), "info");
    } else if (currentUser.hasUpvoted(postItem)) {
      Meteor.call('cancelUpvotePost', postItem._id, function(){
        Events.track("post upvote cancelled", {'_id': postItem._id});
      });        
    } else {
      Meteor.call('upvotePost', postItem._id, function(){
        Events.track("post upvoted", {'_id': postItem._id});
      });  
    }
  },
  'click .downvote-link': function(e){
    var postItem = this;
    var currentUser = Meteor.user();
    e.preventDefault();
    if(!currentUser){
      FlowRouter.go('atSignIn');
      Messages.flash(i18n.t("please_log_in_first"), "info");
    }
    if (currentUser.hasDownvoted(postItem)) {
      Meteor.call('cancelDownvotePost', postItem._id, function(){
        Events.track("post downvote cancelled", {'_id': postItem._id});
      });        
    } else {
      Meteor.call('downvotePost', postItem._id, function(){
        Events.track("post downvoted", {'_id': postItem._id});
      });  
    }
  }  
});