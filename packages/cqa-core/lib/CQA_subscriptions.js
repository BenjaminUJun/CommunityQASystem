CommunityQA.subscriptions.preload('settings');
CommunityQA.subscriptions.preload('currentUser');


//FlowRouter.subscriptions will register global subscriptions and all these regislations will run on every route.
FlowRouter.subscriptions = function() {
  var self = this;
  CommunityQA.subscriptions.forEach(function (eachSub) {
    if (typeof eachSub === 'object'){
      self.register(eachSub.subName, Meteor.subscribe(eachSub.subName, eachSub.subArguments));
    }else{
      self.register(eachSub, Meteor.subscribe(eachSub));
    }
  });
};