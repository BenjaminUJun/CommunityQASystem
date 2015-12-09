Template.post_info.helpers({
  pointOrpointsForDisplay: function(){
  	var postItem = this;
    return postItem.upvotes === 1 ? trans.t('point') : trans.t('points');
  }
});
