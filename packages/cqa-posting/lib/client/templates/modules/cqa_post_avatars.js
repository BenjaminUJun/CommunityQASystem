Template.post_avatars.helpers({
	// in this template, you would use the Template.registerHelper 'getProfileUrl' , 'moduleClass' and  'getDisplayName' 
  commenters: function () {
  	var postItem = this;
    return _.first(_.without(postItem.commenters, postItem.CQAuserId), 4);
  }
});