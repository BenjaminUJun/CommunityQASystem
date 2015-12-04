CQAPostings.getRoute = function() {
	FlowRouter.watchPathChange(); //Reactively watch the changes in the path.
	var nameOfView = this.name;
	var queryForNow = _.clone(FlowRouter.current().queryParams);
	var viewsByDefault = CQASettings.get("defaultView", "top");
	var QueryAgain;

	if (nameOfView === viewsByDefault) {
		delete queryForNow.view;
		QueryAgain = queryForNow;
	} else {
		QueryAgain = _.extend(queryForNow, {view: nameOfView});
	}

	return FlowRouter.path("postsDefault", FlowRouter.current().params, QueryAgain);

};

var menuItemsOfView = [
  {
    route: CQAPostings.getRoute,
    name: 'top',
    label: 'top',
    description: 'most_popular_posts'
  },
  {
    route: CQAPostings.getRoute,
    name: 'new',
    label: 'new',
    description: 'newest_posts'
  },
  {
    route: CQAPostings.getRoute,
    name: 'best',
    label: 'best',
    description: 'highest_ranked_posts_ever'
  },
  {
    route: CQAPostings.getRoute,
    name: 'pending',
    label: 'pending',
    description: 'posts_awaiting_moderation',
    adminOnly: true
  },
  {
    route: CQAPostings.getRoute,
    name: 'rejected',
    label: 'rejected',
    description: 'rejected_posts',
    adminOnly: true
  },
  {
    route: CQAPostings.getRoute,
    name: 'scheduled',
    label: 'scheduled',
    description: 'future_scheduled_posts',
    adminOnly: true
  },
];

CommunityQA.menuItems.add("viewsMenu", menuItemsOfView);
