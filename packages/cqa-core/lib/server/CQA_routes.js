var addPostingsClicks = function (postItemId, ipItem) {
	var clicksEvents = {
		name: 'click',
		properties: {
			CQApostId: postItemId,
			ip: ipItem
		}
	};

	var clicksEventsOfExsistance = CQAEventings.findOne({name: 'click', 'properties.CQApostId': postItemId, 'properties.ip': ipItem});

	if (!clicksEventsOfExsistance) {
		CQAEventings.log(clicksEvents);
		CQAPostings.update(postItemId, { $inc: {clicksCount: 1}});
	}
};

Picker.route('/out', function (params, req, res, next) {
	var getQuery = params.query;
	if (getQuery.url) {
		var postItem = CQAPostings.findOne({url: getQuery.url});
		if (postItem) {
			var ipItem = req.connection.remoteAddress;
			addPostingsClicks(postItem._id, ipItem);
			res.writeHead(302, {'Location': getQuery.url});
			res.end();
		} else {
			res.end('Invalid URL');
		}
	} else {
		res.end("Please provide a URL");
	}
});
