Template.post_domain.helpers({
  domain: function(){
    var createElementOfa = document.createElement('a');
    createElementOfa.href = this.url;
    return createElementOfa.hostname;
  }
});