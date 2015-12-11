Meteor.startup(function () {
	// onAllRoutes is very similar to FastRender.route, but lets you register a callback which will run on all routes.
	FastRender.onAllRoutes(function (path) {
		var self = this;
		CommunityQA.subscriptions.forEach(function (eachSub) {
			if (typeof eachSub === 'object') {
				self.subscribe(eachSub.subName, eachSub.subArguments);
			} else {
				self.subscribe(eachSub);
			}
		});
	});
});