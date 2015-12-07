Template.post_admin.helpers({
  showApproveInfo: function () {
    return !!CQASettings.get('requirePostsApproval') && (this.status === CQAPostings.config.STATUS_PENDING || this.status === CQAPostings.config.STATUS_REJECTED);
  },
  showRejectInfo: function(){
    return !!CQASettings.get('requirePostsApproval') && (this.status === CQAPostings.config.STATUS_PENDING || this.status === CQAPostings.config.STATUS_APPROVED);
  },
  shortScoresInfo: function(){
    return Math.floor(this.scores*100)/100;
  }
});

Template.post_admin.events({
  'click .approve-link': function(e){
    var postItem = this;
    Meteor.call('approvePostings', postItem._id);
    e.preventDefault();
  },
  'click .reject-link': function(e){
    var postItem = this;
    Meteor.call('rejectPostings', postItem._id);
    e.preventDefault();
  },
  'click .delete-link': function(e){
    var postItem = this;

    e.preventDefault();

    if(confirm("Delete “"+postItem.title+"”?")){
      FlowRouter.go('postsDefault');
      Meteor.call("deletePostingsById", postItem._id, function(error) {
        if (error) {
          console.log(error);
          CQAMessages.flash(error.reason, 'error');
        } else {
          CQAMessages.flash(trans.t('your_post_has_been_deleted'), 'success');
        }
      });
    }
  }
});