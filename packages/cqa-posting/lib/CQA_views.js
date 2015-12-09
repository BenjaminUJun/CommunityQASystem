CQAPostings.views =  {};

CQAPostings.views.add = function (nameOfView, functionOfView) {
	CQAPostings.views[nameOfView] = functionOfView; 
}

CQAPostings.views.baseParameters = {
	find: {
		status: CQAPostings.config.STATUS_APPROVED
	},
	options: {
		limit: 10
	}
};

CQAPostings.views.add("top", function (termArgu) {
	return {
		options: {sort: {sticky: -1, scores: -1}}
	};

});

CQAPostings.views.add("new", function (termArgu) {
	return {
		options: {sort: {sticky: -1, postedDate: -1}}
	};
});

CQAPostings.views.add("best", function (termArgu) {
	return {
		options: {sort: {sticky: -1, baseScores: -1}}
	};
});

CQAPostings.views.add("pending", function (termArgu) {
	return {
		find: {
			status: CQAPostings.config.STATUS_PENDING
		},
		options: {sort: {createdDate: -1}},
		showFuture: true
	};
});

CQAPostings.views.add("rejected", function (termArgu) {
	return {
		find: {
			status: CQAPostings.config.STATUS_REJECTED
		},
		options: {sort: {createdDate: -1}},
		showFuture: true
	};
});

CQAPostings.views.add("scheduled", function (termArgu) {
	return {
		find: {postedDate: {$gte: new Date()}},
		options: {sort: {postedDate: -1}},
		showFuture: true
	};
});

CQAPostings.views.add("userPosts", function (termArgu) {
	return {
		find: {CQAuserId: termArgu.CQAuserId}, 
		options: {limit: 5, sort: {postedDate: -1}}
	};
}); 

CQAPostings.views.add("userUpvotedPosts", function (termArgu) {
	var userIntermArgu = Meteor.users.findOne(termArgu.CQAuserId);
	var postingsIds = _.pluck(userIntermArgu.communityqa.upvotedPosts, "itemId");
	return {
		find: {_id: {$in: postingsIds}, CQAuserId: {$ne: termArgu.CQAuserId}},
		options: {limit: 5, sort: {postedDate: -1}}
	};
});

CQAPostings.views.add("userDownvotedPosts", function (termArgu) {
	var userIntermArgu = Meteor.users.findOne(termArgu.CQAuserId);
	var postingsIds = _.pluck(userIntermArgu.communityqa.downvotedPosts, "itemId");

	return {
		find: {_id: {$in: postingsIds}},
		options: {limit: 5, sort: {postedDate: -1}}
	};
});