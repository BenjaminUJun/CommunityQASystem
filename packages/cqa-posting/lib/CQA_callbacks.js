CQAPostings.before.insert(function (CQAuserId, docToInsert) {
	if (!!docToInsert.body) {
		docToInsert.htmlBody = CommunityQA.utils.sanitize(marked(docToInsert.body));
	}
});

CQAPostings.before.update(function (CQAuserId, docToUpdate, namesOfField, modifier) {
	if (Meteor.isServer && modifier.$set && modifier.$set.body) {
		modifier.$set.htmlBody = CommunityQA.utils.sanitize(marked(modifier.$set.body));
	}
	if (Meteor.isServer && modifier.$unset && (typeof modifier.$unset.body !== "undefined")) {
		modifier.$unset.htmlBody = "";
	}
});

CQAPostings.before.update(function (CQAuserId, docToUpdate, namesOfField, modifier)) {
	if (Meteor.isServer && modifier.$set && modifier.$set.title) {
		modifier.$set.slug = CommunityQA.utils.slugify(modifier.$set.title);
	}
}

CQAPostings.before.update(function (CQAuserId, docToUpdate, namesOfField, modifier) {
	if (!!modifier.$rename) {
		throw new Meteor.Error("detected the illegal $rename operator!");
	}
})

function finishOperationOfSubmittingPost (postItem) {
	var CQAuserId = postItem.CQAuserId;
	Meteor.users.update({_id: CQAuserId}, {$inc: {"communityqa.postsCount": 1}});
	return postItem;
}
CommunityQA.callbacks.add("submissionOfPostInAsync", finishOperationOfSubmittingPost);

function upvotionOfSelfPost (postItem) {
	var CQApostAuthor = Meteor.users.findOne(postItem.CQAuserId);
	CommunityQA.upvoteItem(CQAPostings, postItem._id, CQApostAuthor);
	return postItem;
}
CommunityQA.callbacks.add("submissionOfPostInAsync", upvotionOfSelfPost);

function setPostedDate (postItem) {
	if (postItem.isApproved() && !postItem.postedDate) {
		CQAPostings.update(postItem._id, {$set: {postedDate: new Date()}});
	}
}
CommunityQA.callbacks.add("editionOfPostInAsync", setPostedDate);
