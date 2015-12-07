Template.post_author.helpers({
  displayName: function () {
  	var postItem = this;
    var userById = Meteor.users.findOne(postItem.CQAuserId);
    if (userById) {
      return CQAUsers.getDisplayName(userById);
    } else {
      return postItem.CQAauthor;
    }
  }
});