CQAPostings.getLink = function (postItem, isAbsoluteUrl) {
	return !!postItem.url ? CommunityQA.utils.getOutgoingUrl(postItem.url) : this.getPageUrl(postItem, isAbsoluteUrl);
};
CQAPostings.helpers({getLink: function (isAbsoluteUrl) {return CQAPostings.getLink(this, isAbsoluteUrl);}});

CQAPostings.getShareableLink = function (postItem) {
	return CQASettings.get("outsideLinksPointTo", "link") === "link" ?  CQAPostings.getLink(postItem) : CQAPostings.getPageUrl(postItem, true);
};
CQAPostings.helpers({getShareableLink: function () {return CQAPostings.getShareableLink(this);}});

CQAPostings.getLinkTarget = function (postItem) {
	return !!postItem.url ? "_blank" : ""; 
};
CQAPostings.helpers({getLinkTarget: function () {return CQAPostings.getLinkTarget(this);}});

CQAPostings.getPageUrl = function (postItem, isAbsoluteUrl) {
	var isAbsoluteUrl = typeof isAbsoluteUrl === "undefined" ? false : isAbsoluteUrl;
	var prefixOfUrl = isAbsoluteUrl ? CommunityQA.utils.getSiteUrl().slice(0,-1) : "";
	return prefixOfUrl + FlowRouter.path("postPage", postItem);
};
CQAPostings.helpers({getPageUrl: function (isAbsoluteUrl) {return CQAPostings.getPageUrl(this, isAbsoluteUrl);}});

CQAPostings.getEditUrl = function (postItem, isAbsoluteUrl){
	var isAbsoluteUrl = typeof isAbsoluteUrl === "undefined" ? false : isAbsoluteUrl;
	var prefixOfUrl = isAbsoluteUrl ? CommunityQA.utils.getSiteUrl().slice(0, -1) : "";
	return prefixOfUrl + FlowRouter.path("postEdit", postItem);
};
CQAPostings.helpers({getEditUrl: function (isAbsoluteUrl) {return CQAPostings.getEditUrl(this, isAbsoluteUrl);}});

CQAPostings.getAuthorName = function (postItem) {
	var userOfPost = Meteor.users.findOne(postItem.CQAuserId);
	if (userOfPost) {
		return userOfPost.getDisplayName();
	} else {
		return postItem.CQAauthor;
	}
};
CQAPostings.helpers({getAuthorName: function () {return CQAPostings.getAuthorName(this);}});

CQAPostings.getDefaultStatus = function (userToPost) {
	var ownRightsOfAdministrator = typeof userToPost === "undefined" ? false : CQAUsers.is.admin(userToPost);
	if (ownRightsOfAdministrator || !CQASettings.get('requirePostsApproval', false)) {
		return CQAPostings.config.STATUS_APPROVED;
	}else {
		return CQAPostings.config.STATUS_PENDING;
	}
};

CQAPostings.isApproved = function (postItem) {
	return postItem.status === CQAPostings.config.STATUS_APPROVED;
};
CQAPostings.helpers({isApproved: function () {return CQAPostings.isApproved(this);}});

CQAPostings.checkForSameUrl = function (urlToCheck) {
	var dateBeforeSixMonths = moment().subtract(6, 'months').toDate();
	var postOftheSameLinkUrl = CQAPostings.findOne({url: urlToCheck, postedDate: {$gte: dateBeforeSixMonths}});

	if (typeof postOftheSameLinkUrl !== "undefined") {
		throw new Meteor.Error('603', trans.t('this_link_has_already_been_posted'), postOftheSameLinkUrl._id);
	}
};

CQAPostings.current = function () {
	return CQAPostings.findOne(FlowRouter.getParam("_id"));
}

CQAPostings.isVideo = function (postItem) {
	return postItem.media && postItem.media.type === "video";
}
CQAPostings.helpers({isVideo: function () {return CQAPostings.isVideo(this);}});