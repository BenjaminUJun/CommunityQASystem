CQAPostings.parameters = {};

CQAPostings.parameters.get = function (termArgu) {
	check(termArgu, Match.Any);

	var paraInitials = CommunityQA.utils.deepExtend(true, {}, CQAPostings.views.baseParameters);
	paraInitials = CommunityQA.callbacks.run("paramsForPostings", paraInitials, termArgu);

	if (_.isEmpty(paraInitials.options.sort)) {
		paraInitials.options.sort = {sticky: -1, scores: -1};
	}

	paraInitials = CommunityQA.utils.deepExtend(true, paraInitials, {options: {sort: {_id: -1}}});
	
	return paraInitials;
}

function addParametersOfViews (paraInitials, termArgu) {
	var addViews = !!termArgu.view ? CommunityQA.utils.dashToCamel(termArgu.view) : 'top';

	if(typeof CQAPostings.views[addViews] !== 'undefined')
		paraInitials = CommunityQA.utils.deepExtend(true, paraInitials, CQAPostings.views[addViews](termArgu));

	return paraInitials;
}

CommunityQA.callbacks.add("paramsForPostings", addParametersOfViews);

function addParametersOfTimes (paraInitials, termArgu) {
	if (typeof paraInitials.find.postedDate === "undefined") {
		var postedDate = {};

		if (termArgu.after) {
			postedDate.$gte = moment(termArgu.after, "YYYY-MM-DD").startOf('day').toDate();
		}

		if (termArgu.before) {
			postedDate.$lt = moment(termArgu.before, "YYYY-MM-DD").endOf('day').toDate();
		}

		if (!_.isEmpty(postedDate)) {
			paraInitials.find.postedDate = postedDate;
		}
	}

	return paraInitials;
}
CommunityQA.callbacks.add("paramsForPostings", addParametersOfTimes);

function limitNumberOfPostings (paraInitials, termArgu) {
	var  maxNumber = 200;
	if (typeof termArgu.limit !== 'undefined') {
		_.extend(paraInitials.options, {limit: parseInt(termArgu.limit)});
	}

	if (!paraInitials.options.limit || paraInitials.options.limit === 0 || paraInitials.options.limit > maxNumber) {
		paraInitials.options.limit = maxNumber;
	}

	return paraInitials;

}

CommunityQA.callbacks.add("paramsForPostings", limitNumberOfPostings);

function concealPostingsOfFuture (paraInitials, termArgu) {
	var withinAnHour = moment().add(1, "hour").toDate();

	if (!paraInitials.showFuture) {
		if (!!paraInitials.find.postedDate) {
			if (!!paraInitials.find.postedDate.$lt) {
				var lt = paraInitials.find.postedDate.$lt;
				paraInitials.find.postedDate.$lt = lt < withinAnHour ? lt : withinAnHour;
			} else {
				paraInitials.find.postedDate.$lt = withinAnHour;
			}
		} else {
			paraInitials.find.postedDate = {$lt: withinAnHour};
		}
	}

	return paraInitials;
}
CommunityQA.callbacks.add("paramsForPostings", concealPostingsOfFuture);
