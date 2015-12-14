Template.registerHelper('isLoggedIn', function () {
	return !!Meteor.user();
}); 

Template.registerHelper('canView', function () {
	var currentUser = Meteor.user();
	return CQAUsers.can.view(currentUser);
});

Template.registerHelper('canPost', function () {
	var currentUser = Meteor.user();
	return CQAUsers.can.post(currentUser);
});

Template.registerHelper('canComment', function () {
	var currentUser = Meteor.user();
	return CQAUsers.can.comment(currentUser);
});

Template.registerHelper('isAdmin', function (userItem) {
	userItem = typeof userItem === "undefined" ? Meteor.user() : userItem;
	if (CQAUsers.is.admin(Meteor.user())) {
		return true;
	}
	return false;
});

Template.registerHelper('canEdit', function (item) {
	var currentUser = Meteor.user();
	return CQAUsers.can.edit(currentUser, item, false);
});

Template.registerHelper('log', function (dataContext) {
	console.log(dataContext);
});

Template.registerHelper('formatDate', function (dateOfTime, formatOfDate) {
	Session.get('momentLocale');
	return moment(dateOfTime).format(formatOfDate);
});

Template.registerHelper('timeAgo', function (dateOfTime) {
	Session.get('momentLocale');
	return moment(dateOfTime).fromNow();
});

Template.registerHelper('sanitize', function (contents) {
	console.log('cleaning up ...');
	console.log(contents);
	return CommunityQA.utils.cleanUp(contents);
});

Template.registerHelper('pluralize', function (counts, stringToSet) {
	stringToSet = counts === 1 ? stringToSet : stringToSet + 's';
	return trans.t(stringToSet);
});

Template.registerHelper('getProfileUrl', function (userIdOrUser) {
	var currentUser = (typeof userIdOrUser === 'string') ? Meteor.users.findOne(userIdOrUser) : userIdOrUser;
	if (!!currentUser) {
		return CQAUsers.getProfileUrl(currentUser);
	}
});

Template.registerHelper('getUsername', function (userIdOrUser) {
	var currentUser = (typeof userIdOrUser === 'string') ? Meteor.users.findOne(userIdOrUser) : userIdOrUser;
	if (!!currentUser) {
		return CQAUsers.getUserName(currentUser);
	}
});

Template.registerHelper('getDisplayName', function (userIdOrUser) {
	var currentUser = (typeof userIdOrUser === 'string') ? Meteor.users.findOne(userIdOrUser) : userIdOrUser;
	if (!!currentUser) {
		return CQAUsers.getDisplayName(currentUser);
	}
});

Template.registerHelper('icon', function (iconToName, iconToClass) {
	return CommunityQA.utils.getIcon(iconToName, iconToClass);
});

Template.registerHelper('moduleClass', function () {
	var dataZone = Template.parentData(4);
	if (dataZone) {
		var moduleClassVari = dataZone.zone + "-module ";
		if (dataZone.moduleClass) {
			moduleClassVari += dataZone.moduleClass;
		}
		return moduleClassVari;
	}
});