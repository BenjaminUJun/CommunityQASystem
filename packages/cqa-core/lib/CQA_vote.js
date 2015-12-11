// use $inc to increment the value of the 'telescope.karma' key by karma 

var changeKarma = function (CQAuserId, karmaValue) {
	Meteor.users.update({_id: CQAuserId}, {$inc: {"communityqa.karma": karmaValue}});
};

//indexOf() used for String Object.
var hasItemForUpvoted = function (voteItem, cqaUser) {
	return voteItem.upvoters && voteItem.upvoters.indexOf(cqaUser._id) !== -1;
};

var hasItemForDownvoted = function (voteItem, cqaUser) {
	return voteItem.downvoters && voteItem.downvoters.indexOf(cqaUser._id) !== -1;
}; 

var addVote = function (CQAuserId, voteItem, collection, downOrUp) {
	var keys = 'communityqa.' + downOrUp + 'voted' + collection;
	var addition = {};
	addition[keys] = voteItem;
	Meteor.users.update({_id: CQAuserId}, {
		$addToSet: addition
	});
};
//$pull: remove elements based on the given criteria
var removeVote = function (CQAuserId, voteItemId, collection, downOrUp) {
	var keys = 'communityqa.' + downOrUp + 'voted' + collection;
	var removal = {};
	removal[keys] = {itemId: voteItemId};
	Meteor.users.update({_id: CQAuserId}, {
		$pull: removal
	});
};

CommunityQA.upvoteItem = function (collection, voteItemId, cqaUser) {
	cqaUser = typeof cqaUser === "undefined" ? Meteor.user() : cqaUser;
	var getCollectionName = collection._name.slice(0, 1).toUpperCase() + collection._name.slice(1);
	var voteItem = collection.findOne(voteItemId);

	if(!cqaUser || !CQAUsers.can.vote(cqaUser, true) || hasItemForUpvoted(voteItem, cqaUser)) {
		return false;
	}

	voteItem = CommunityQA.callbacks.run("upvote", voteItem);

	var votePowers = getVotePower(cqaUser);

	CommunityQA.cancelDownvote(collection, voteItemId, cqaUser);

	var results = collection.update({_id: voteItem && voteItem._id, upvoters: {$ne: cqaUser._id}}, {
		$addToSet: {upvoters: cqaUser._id},
		$inc: {upvotes: 1, baseScores: votePowers},
		$set: {inactive: false}
	});

	if (results > 0) {
		var votes = {
			itemId: voteItem._id,
			votedDate: new Date(),
			power: votePowers
		};
		addVote(cqaUser._id, votes, getCollectionName, 'up');

		voteItem = _.extend(voteItem, {baseScores: (voteItem.baseScores + votePowers)});

		CommunityQA.updateScore({collection: collection, item: voteItem, forceUpdate: true});

		if (voteItem.CQAuserId !== cqaUser._id) {
			changeKarma(voteItem.CQAuserId, votePowers);

			if (CQASettings.get('redistributeKarma', false)) {
				_.each(voteItem.upvoters, function (upvoterId) {
					var karmaIncrements = Math.min(0.1, votePowers/voteItem.upvoters.length);
					changeKarma(upvoterId, karmaIncrements);
				});
			}
		}

		CommunityQA.callbacks.runAsync("upvoteAsync", voteItem);
	}

	return true;
};

CommunityQA.downvoteItem = function (collection, voteItemId, cqaUser) {
	cqaUser = typeof cqaUser === "undefined" ? Meteor.user() : cqaUser;

	var getCollectionName = collection._name.slice(0, 1).toUpperCase() + collection._name.slice(1);

	var voteItem = collection.findOne(voteItemId);

	if (!cqaUser || !CQAUsers.can.vote(cqaUser, true) || hasItemForDownvoted(voteItem, cqaUser)) {
		return false;
	}

	voteItem = CommunityQA.callbacks.run("downvote", voteItem);

	var votePowers = getVotePower(cqaUser);

	CommunityQA.cancelUpvote(collection, voteItem, cqaUser);

	var results = collection.update({_id: voteItem && voteItem._id, downvoters: { $ne: cqaUser._id }}, {
		$addToSet: {downvoters: cqaUser._id},
		$inc: {downvotes: 1, baseScores: -votePowers},
		$set: {inactive: false}
	});

	if (results > 0) {
		var votes = {
			itemId: voteItem._id,
			votedDate: new Date(),
			power: votePowers
		};
		addVote(cqaUser._id, votes, getCollectionName, 'down');

		voteItem = _.extend(voteItem, {baseScores: (voteItem.baseScores - votePowers)});

		CommunityQA.updateScore({collection: collection, item: voteItem, forceUpdate: true});

		if (voteItem.CQAuserId !== cqaUser._id) {
			changeKarma(voteItem.CQAuserId, votePowers);
		}

		CommunityQA.callbacks.runAsync("downvoteAsync", voteItem);

	}

	return true;
};

CommunityQA.cancelUpvote = function (collection, voteItemId, cqaUser) {
	
	cqaUser = typeof cqaUser === "undefined" ? Meteor.user() : cqaUser;
	var getCollectionName = collection._name.slice(0, 1).toUpperCase() + collection._name.slice(1);
	var voteItem = collection.findOne(voteItemId);

	if (!hasItemForUpvoted(voteItem, cqaUser)) {
		return false;
	}

	voteItem = CommunityQA.callbacks.run("cancelUpvote", voteItem);

	var votePowers = getVotePower (cqaUser);

	var results = collection.update({_id: voteItem && voteItem._id, upvoters: cqaUser._id}, {
		$pull: {upvoters: cqaUser._id},
		$inc: {upvotes: -1, baseScores: -votePowers},
		$set: {inactive: false}
	});

	if (results > 0) {
		removeVote(cqaUser._id, voteItem._id, getCollectionName, 'up');

		voteItem = _.extend(voteItem, {baseScores: (voteItem.baseScores - votePowers)});
		CommunityQA.updateScore({collection: collection, item: voteItem, forceUpdate: true});

		if (voteItem.CQAuserId !== cqaUser._id) {
			changeKarma(voteItem.CQAuserId, votePowers);
		}

		CommunityQA.callbacks.runAsync("cancelUpvoteAsync", voteItem);
	}

	return true;
};

CommunityQA.cancelDownvote = function (collection, voteItemId, cqaUser) {
	cqaUser = typeof cqaUser === "undefined" ? Meteor.user() : cqaUser;
	var getCollectionName = collection._name.slice(0, 1).toUpperCase() + collection._name.slice(1);
	var voteItem = collection.findOne(voteItemId);

	if (!hasItemForDownvoted(voteItem, cqaUser)) {
		return false;
	}

	voteItem = CommunityQA.callbacks.run("cancelDownvote", voteItem);

	var votePowers = getVotePower(cqaUser);

	var results = collection.update({_id: voteItem && voteItem._id, downvoters: cqaUser._id}, {
		$pull: {downvoters: cqaUser._id},
		$inc: {downvotes: -1, baseScores: votePowers},
		$set: {inactive: false}
	});

	if (results > 0) {
		removeVote(cqaUser._id, voteItem._id, getCollectionName, 'down');
		voteItem = _.extend(voteItem, {baseScores: (voteItem.baseScores + votePowers)});

		CommunityQA.updateScore({collection: collection, item: voteItem, forceUpdate: true});

		if (voteItem.CQAuserId !== cqaUser._id) {
			changeKarma(voteItem.CQAuserId, votePowers);
		}

		CommunityQA.callbacks.runAsync("cancelDownvoteAsync", voteItem);
	}

	return true;
};

Meteor.methods({
	upvotePost: function (postingId) {
		check(postingId, String);
		return CommunityQA.upvoteItem.call(this, CQAPostings, postingId);
	}, 
	downvotePost: function (postingId) {
		check(postingId, String);
		return CommunityQA.downvoteItem.call(this, CQAPostings, postingId);
	},
	cancelUpvotePost: function (postingId) {
		check(postingId, String);
		return CommunityQA.cancelUpvote.call(this, CQAPostings, postingId);
	},
	cancelDownvotePost: function (postingId) {
		check(postingId, String);
		return CommunityQA.cancelDownvote.call(this, CQAPostings, postingId);
	},
	upvoteComment: function (commentingId) {
		check(commentingId, String);
		return CommunityQA.upvoteItem.call(this, CQACommentings, commentingId);
	},
	downvoteComment: function (commentingId) {
		check(commentingId, String);
		return CommunityQA.downvoteItem.call(this, CQACommentings, commentingId);
	},
	cancelUpvoteComment: function (commentingId) {
		check(commentingId, String);
		return CommunityQA.cancelUpvote.call(this, CQACommentings, commentingId);
	},
	cancelDownvoteComment: function (commentingId) {
		check(commentingId, String);
		return CommunityQA.cancelDownvote.call(this, CQACommentings, commentingId);
	}
}); 
