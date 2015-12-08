Template.post_item.helpers({
  postingsClass: function () {
    var postItem = this;
    var postingsClass = "post ";
    
    postingsClass += "author-"+ CommunityQA.utils.slugify(postItem.CQAauthor)+" ";

    if (postItem.sticky) {
      postingsClass += "sticky ";
    }
    postingsClass = CommunityQA.callbacks.run("postClass", postingsClass, postItem);
    return postingsClass;
  }
});
