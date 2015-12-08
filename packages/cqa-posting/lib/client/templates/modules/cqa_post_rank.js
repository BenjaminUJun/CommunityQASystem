Template.post_rank.helpers({
  basedRankByOne: function(){
  	var postItem = this;
    if (typeof postItem.rank !== 'undefined') {
      return postItem.rank + 1;
    }
  }
});