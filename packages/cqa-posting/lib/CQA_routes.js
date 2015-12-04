FlowRouter.route('/', {
  name: "postsDefault",
  action: function(params, queryParams) {
    //render the layout
    BlazeLayout.render("layout", {main: "main_posts_list"});
  }
});

FlowRouter.route('/posts/:_id/edit', {
  name: "postEdit",
  action: function(params, queryParams) {
    //render the layout
    BlazeLayout.render("layout", {main: "post_edit"});
  }
});

FlowRouter.route('/posts/:_id/:slug?', {
  name: "postPage",
  action: function(params, queryParams) {
    //render the layout
    BlazeLayout.render("layout", {main: "post_page"});
  }
});

var trackRouteEntry = function (context) {
    // context is the output of `FlowRouter.current()
  var sessionItemId = Meteor.default_connection && Meteor.default_connection._lastSessionId ? Meteor.default_connection._lastSessionId : null;
  Meteor.call('increasePostViews', context.params._id, sessionItemId);
};

FlowRouter.route('/submit', {
  name: "postSubmit",
  action: function(params, queryParams) {
    //render the layout
    BlazeLayout.render("layout", {main: "post_submit"});
  }
});