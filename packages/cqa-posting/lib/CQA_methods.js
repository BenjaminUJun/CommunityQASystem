CQAPostings.submit = function (postItem) {
	var CQAuserId = postItem.CQAuserId, CQAuser = CQAUsers.findOne(CQAuserId);

	if (!postItem.title) {
		throw new Meteor.Error(602, trans.t('please_fill_in_a_title'));
	}

	if (!!postItem.url) {
		CQAPostings.checkForSameUrl(postItem.url, CQAuser);
	}

	var propertiesOfDefault = {
		createdDate: new Date(),
		CQAauthor: CQAUsers.getDisplayNameById(CQAuserId),
		upvotes: 0,
		downvotes: 0,
		commentsCount: 0,
		clicksCount: 0,
		viewsCount: 0,
		baseScores: 0,
		scores: 0,
		inactive: false,
		sticky: false,
		status: CQAPostings.getDefaultStatus()
	};

	postItem = _.extend(propertiesOfDefault, postItem);

	if (postItem.status === CQAPostings.config.STATUS_APPROVED && !postItem.postedDate) {
		postItem.postedDate = new Date();
	}

	postItem.title = CommunityQA.utils.cleanUp(postItem.title);
	
	postItem.slug = CommunityQA.utils.slugify(postItem.title);

	postItem = CommunityQA.callbacks.run("submissionOfPost", postItem);

	postItem._id = CQAPostings.insert(postItem);

	CommunityQA.callbacks.runAsync("submissionOfPostInAsync", CQAPostings.findOne(postItem._id));

	return postItem;
};

CQAPostings.edit = function (postItemId, modifier, postItem) {
	if (typeof postItem === "undefined") {
		postItem = CQAPostings.findOne(postItemId);
	}

	modifier = CommunityQA.callbacks.run("editionOfPost", modifier, postItem);

	CQAPostings.update(postItemId, modifier);

	CommunityQA.callbacks.runAsync("editionOfPostInAsync", CQAPostings.findOne(postItemId), postItem);

	return CQAPostings.findOne(postItemId);
};

var viewsForPost = [];

Meteor.method({
	submitPost: function(postItem){
		check(postItem, CQAPostings.simpleSchema());

		var currentuser = Meteor.user(), ownRightsOfAdministrator = CQAUsers.is.admin(currentuser), schemaForPostings = CQAPostings.simpleSchema()._schema;

		if (!currentuser || !CQAUsers.can.post(currentuser)) {
			throw new Meteor.Error(601, trans.t('you_need_to_login_or_be_invited_to_post_new_stories'));
		}

		if (!ownRightsOfAdministrator) {
			var durationAfterLastPosting = CQAUsers.timeSinceLast(currentuser, CQAPostings),
				postingstimesInLastDay = CQAUsers.numberOfItemsInPast24Hours(currentuser, CQAPostings),
				intervalsOfPost = Math.abs(parseInt(CQASettings.get('postInterval', 30)));		
				limitOfPostsByDay = Math.abs(parseInt(CQASettings.get('maxPostsPerDay', 30)));

			if (durationAfterLastPosting < intervalsOfPost){
				throw new Meteor.Error(604, trans.t('please_wait') + (intervalsOfPost - durationAfterLastPosting) + trans.t('seconds_before_posting_again'));
			}	

			if (postingstimesInLastDay > limitOfPostsByDay) {
				throw new Meteor.Error(605, trans.t('sorry_you_cannot_submit_more_than') + limitOfPostsByDay + trans.t('posts_per_day'));
			}

		}

		_.keys(postItem).forEach(function (namesOfField) {

			var Schemafield = schemaForPostings[namesOfField];
			if (!CQAUsers.can.submitField(currentuser, Schemafield)) {
				throw new Meteor.Error("disallowed_property", trans.t('disallowed_property_detected') + ": " + namesOfField);
			}
		});

		if (!postItem.status) {
			postItem.status = CQAPostings.getDefaultStatus(currentuser);
		}

		if (!postItem.CQAuserId) {
			postItem.CQAuserId = currentuser._id;
		}

		return CQAPostings.submit(postItem);
	},

	editPost: function (modifier, postItemId) {
		check(modifier, Match.OneOf({$set: CQAPostings.simpleSchema()}, {$unset: Object}, {$set: CQAPostings.simpleSchema(), $unset: Object}));
		check(postItemId, String);

		var currentuser = Meteor.user(), postById = CQAPostings.findOne(postItemId), schemaForPostings = CQAPostings.simpleSchema()._schema;

		if (!currentuser || !CQAUsers.can.edit(currentuser, postById)){
			throw new Meteor.Error(601, trans.t('sorry_you_cannot_edit_this_post'));
		}

		_.each(modifier, function (operationInModifier){
			_.keys(operationInModifier).forEach(function (namesOfField) {
				var fieldInSchema = schemaForPostings[namesOfField];
				if (!CQAUsers.can.editField(currentuser, fieldInSchema, postById)) {
					throw new Meteor.Error("disallowed_property", trans.t('disallowed_property_detected') + ": " + namesOfField);
				}
			});
		});

		return CQAPostings.edit(postItemId, modifier, postItem);
	},


	setPostedDate: function(postItem, customPostedDate) {
		check(postItem, CQAPostings.simpleSchema());
		check(customPostedDate, Date);

		var postedDate = new Date();

		if(CQAUsers.is.admin(Meteor.user()) && typeof customPostedDate !== 'undefined') {
			postedDate = customPostedDate;
		}

		CQAPostings.update(postItem._id, {$set: {postedDate: postedDate}});
	},

	approvePost: function(postItemId) {
		check(postItemId, String);

		var postById = CQAPostings.findOne(postItemId);

		var now = new Date();

		if (CQAUsers.is.admin(Meteor.user())) {
			var set = {status: CQAPostings.config.STATUS_APPROVED};

			if (!postById.postedDate) {
				set.postedDate = now;
			}

			CQAPostings.update(postById._id, {$set: set});

			CommunityQA.callbacks.runAsync("approvalOfPostInAsync", postById);
		} else {
			CQAMessages.flash('You need to be an admin to do that.', "error");
		}
	},

	rejectPost: function(postItemId) {
		check(postItemId, String);
		var postById = CQAPostings.findOne(postItemId);

		if (CQAUsers.is.admin(Meteor.user())) {
			
			CQAPostings.update(postById._id, {$set: {status: CQAPostings.config.STATUS_REJECTED}});

			CommunityQA.callbacks.runAsync("rejectionOfPostInAsync");

		} else {
			CQAMessages.flash('You need to be an admin to do that.', "error");
		}
	},

	increasePostViews: function(postItemId, sessionItemId) {
		check(postItemId, String);
		check(sessionItemId, String);

		this.unblock(); //Call inside a method invocation. Allow subsequent method from this client to begin running in a new fiber.

		var viewsForCounter =  {_id: postItemId, CQAuserId: this.userId, sessionId: sessionItemId};

		if (_.where(viewsForPost, viewsForCounter).length === 0) {
			viewsForPost.push(viewsForCounter);
			CQAPostings.update(postItemId, { $inc: { viewsCount: 1}});
		}
	},

	deletePostById: function(postItemId) {
		check(postItemId, String);

		var postById = CQAPostings.findOne({_id: postItemId});

		if(!Meteor.userId() || !CQAUsers.can.editById(Meteor.userId(), postById)) {
			throw new Meteor.Error(606, 'You need permission to edit or delete a post');
		}

		CQAUsers.update({_id: postById.CQAuserId}, {$inc: {"communityqa.postsCount": -1}});

		CQAPostings.remove(postItemId);

		CommunityQA.callbacks.runAsync("deletionOfPostInAsync", postById);
	},

	checkForDuplicates: function(urlToCheck) {
		CQAPostings.checkForSameUrl(urlToCheck);
	}
});
