var fetchDays = function (countOfDays) {
	var manyDays = [];

	for (var i = 0; i < countOfDays; i++) {
		manyDays.push({
			date: moment().subtract(i, 'days').startOf('day').toDate(), 
			index: i
		});
	}
	return manyDays;
};

CQAPostings.fastRenderSubscribe = function (parameters) {

	var self = this;
	var categoryArray = [];
	var count = 0;

	while(!!parameters.query["cat["+count+"]"]) {
		categoryArray.push(parameters.query["cat["+count+"]"]);
		delete parameters.query["cat["+count+"]"];
		count++;
	}

	if (categoryArray.length) {
		parameters.query.cat = categoryArray;
	}

	if (!parameters.query.limit) {
		parameters.query.limit = CQASettings.get('postsPerpage', 10);
	}

	if (parameters.query.view === 'daily') {
		var numberOfDays = parameters.days ? parameters.days : 5;
		var daysToFetch = fetchDays(numberOfDays);

		daysToFetch.forEach(function (eachDay){
			var termsOfSubscription = {
				view: "top",
				date: eachDay.date,
				after: moment(eachDay.date).format("YYYY-MM-DD"),
				before: moment(eachDay.date).format("YYYY-MM-DD")
			};
			self.subscribe('postsList', termsOfSubscription);
			self.subscribe('postsListUsers', termsOfSubscription);

		});
	} else {

		self.subscribe('postsList', parameters.query);
		self.subscribe('postsListUsers', parameters.query);
	}
};

Meteor.startup(function () {
	 // for more infomation about FastRender API, visit https://github.com/kadirahq/fast-render
	FastRender.route("/", CQAPostings.fastRenderSubscribe);
	FastRender.route("/posts/:_id/:slug?", function (parameters) {
		var CQApostId = parameters._id;
		this.subscribe('singlePost', CQApostId);
		this.subscribe('postUsers', CQApostId);
		this.subscribe('commentsList', {view: 'postComments', CQApostId: CQApostId});
	});
});