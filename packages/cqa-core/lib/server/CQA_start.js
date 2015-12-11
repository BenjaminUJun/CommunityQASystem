Meteor.startup(function () {
	CQAEventings.log({
		name: "firstRun",
		unique: true,
		important: true
	});
});

if (CQASettings.get('mailUrl')) {
	process.env.MAIL_URL = CQASettings.get('mailUrl');
}

Meteor.startup(function () {
	SyncedCron.start();
});