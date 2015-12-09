CQAPostings._ensureIndex({"status": 1, "postedDate": 1});

Meteor.publish('postsList', function (termArgu) {
	termArgu.CQAuserId = this.userId;

	if (CQAUsers.can.viewById(this.userId)) {
		var getParameters = CQAPostings.parameters.get(termArgu),
			postings = CQAPostings.find(getParameters.find, getParameters.options);

		return postings; 
	}
	return [];
});

Meteor.publish('postsListUsers', function (termArgu) {
	termArgu.CQAuserId = this.userId;

	if (CQAUsers.can.viewById(this.userId)) {
		var getParameters = CQAPostings.parameters.get(termArgu), 
		postings = CQAPostings.find(getParameters.find, getParameters.options), 
		CQAuserIds = _.pluck(postings.fetch(), 'CQAuserId');

		postings.forEach(function (posting) {
			CQAuserIds = CQAuserIds.concat(_.first(posting.commenters, 4));
		});

		CQAuserIds = _.unique(CQAuserIds);

		return Meteor.users.find({_id: {$in: CQAuserIds}}, {fields: CQAUsers.pubsub.avatarProperties, multi: true});
	}

	return [];
});

Meteor.publish('singlePost', function (CQApostingsId) {
	check(CQApostingsId, String);

	if (CQAUsers.can.viewById(this.userId)) {
		return CQAPostings.find(CQApostingsId);
	}
	return [];
});

Meteor.publish('postUsers', function (CQApostingsId) {
	check(CQApostingsId, String);
	if (CQAUsers.can.viewById(this.userId)) {
		var posting = CQAPostings.findOne(CQApostingsId);
		var CQAusers = [];

		if (posting) {
			CQAusers.push(posting.CQAuserId);

			var commentings = CQACommentings.find({CQApostId: posting._id}).fetch();
			if (commentings.length) {
				CQAusers = CQAusers.concat(_.pluck(commentings, "CQAuserId"));
			}

			if (posting.upvoters && posting.upvoters.length) {
				CQAusers = CQAusers.concat(posting.upvoters);
			}

			if (posting.downvoters && posting.downvoters.length) {
				CQAusers = CQAusers.concat(posting.downvoters);
			}

		}

		CQAusers = _.unique(CQAusers);
		return Meteor.users.find({_id: {$in: CQAusers}}, {fields: CQAUsers.pubsub.publicProperties});
	}
	return [];
});