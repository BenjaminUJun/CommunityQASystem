CQAPostings.schema = new SimpleSchema({
	_id: {
		type: String,
		optional: true
	},

  	createdDate: {
		type: Date,
		optional: true
	},

	postedDate: {
		type: Date,
		optional: true,
		editableBy: ["CQAadmin"],
		autoform: {
			group: 'CQAadmin',
			type: "bootstrap-datetimepicker"
		}
	},

	url: {
		type: String,
		optional: true,
		max: 500,
		editableBy: ["CQAmember", "CQAadmin"],
		autoform: {
			type: "bootstrap-url",
			order: 10
		}
	},
	
	title: {
		type: String,
		optional: false,
		max: 500,
		editableBy: ["CQAmember", "CQAadmin"],
		autoform: {
			order: 20
		}
	},

	slug: {
		type: String,
		optional: true
	},
	
	body: {
		type: String,
		optional: true,
		max: 3000,
		editableBy: ["CQAmember", "CQAadmin"],
		autoform: {
			rows: 5,
			order: 30
		}
	},

	htmlBody: {
		type: String,
		optional: true
	},

	viewsCount: {
		type:	Number,
		optional: true
	},

	commentsCount: {
		type: Number,
		optional: true
	},

	lastCommentedDate: {
		type: Date,
		optional: true
	},

	clicksCount: {
		type: Number,
		optional: true
	},

	baseScores: {
		type: Number,
		decimal: true,
		optional: true
	},

	upvotes: {
		type: Number,
		optional: true
	},

	upvoters: {
		type: [String],
		optional: true
	},

	downvotes: {
		type:	Number,
		optional: true
	},

	downvoters: {
		type: [String],
		optional: true
	}

	scores: {
		type: Number,
		decimal: true,
		optional: true
	},
	
	status: {
		type: Number,
		optional: true,
		editableBy: ['CQAadmin'],
		autoValue: function () {
			var posteduser = Meteor.users.findOne(this.CQAuserId);
			if (this.isInsert && !this.isSet)
				return CQAPostings.getDefaultStatus(posteduser);
		},
		autoform: {
			noselect: true,
			options: CQAPostings.config.postStatuses,
			group: 'CQAadmin'
		}
	},
	
	sticky: {
		type: Boolean,
		optional: true,
		defaultValue: false,
		editableBy: ["CQAadmin"],
		autoform: {
			group: 'CQAadmin',
			leftLabel: "Sticky"
		}
	},

	inactive: {
		type: Boolean,
		optional: true
	},

	CQAauthor: {
		type: String,
		optional: true
	},

	CQAuserId: {
		type: String,
		optional: true,
		editableBy: ["CQAadmin"],
		autoform: {
			group: 'CQAadmin',
			options: function () {
				return Meteor.users.find().map(function (item) {
					return {
						value: item._id,
						label: CQAUsers.getDisplayName(item)
					}; 		
				});
			}
		}
	}
});

Meteor.startup(function(){
	CQAPostings.internationalize();		
});

CQAPostings.attachSchema(CQAPostings.schema);

CQAPostings.allow({
	update: _.partial(CommunityQA.allowCheck, CQAPostings),
	remove: _.partial(CommunityQA.allowCheck, CQAPostings)
});
