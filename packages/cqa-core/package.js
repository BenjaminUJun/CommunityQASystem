Package.describe({
  name: 'jyu103:cqa-core',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Community Question Answering System Posting',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/BenjaminUJun/CommunityQASystem.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {

  api.versionsFrom("METEOR@1.2");
  
  var packages = [
    'jyu103:cqa-lib@0.0.1', 
    'jyu103:cqa-messages@0.0.1',
    'jyu103:cqa-trans@0.0.1', 
    'jyu103:cqa-eventing@0.0.1', 
    'jyu103:cqa-setting@0.0.1', 
    'jyu103:cqa-users@0.0.1', 
    'jyu103:cqa-commenting@0.0.1',
    'jyu103:cqa-posting@0.0.1' 
  ];

  api.use(packages);
  
  api.imply(packages);

  api.addFiles([
    'lib/CQA_modules.js',
    'lib/CQA_vote.js',
    'lib/CQA_subscriptions.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/cqa_handlebars.js',
    'lib/client/main.html',
    'lib/client/main.js',
    'lib/client/scripts/jquery.quickfit.js',
    'lib/client/templates/modules/cqa_modules.html',
    'lib/client/templates/modules/cqa_modules.js',
    'lib/client/templates/admin/cqa_admin_menu.html',
    'lib/client/templates/admin/cqa_admin_menu.js',
    'lib/client/templates/admin/cqa_admin_wrapper.html',
    'lib/client/templates/common/cqa_css.html',
    'lib/client/templates/common/cqa_css.js',
    'lib/client/templates/common/cqa_footer_code.html',
    'lib/client/templates/common/cqa_footer_code.js',
    'lib/client/templates/common/cqa_loader.html',
    'lib/client/templates/common/cqa_checker.html',
    'lib/client/templates/common/cqa_checker.js',
    'lib/client/templates/common/cqa_layout.html',
    'lib/client/templates/common/cqa_layout.js',
    'lib/client/templates/errors/cqa_already_logged_in.html',
    'lib/client/templates/errors/cqa_loading.html',
    'lib/client/templates/errors/cqa_loading.js',
    'lib/client/templates/errors/cqa_no_account.html',
    'lib/client/templates/errors/cqa_no_account.js',
    'lib/client/templates/errors/cqa_no_invite.html',
    'lib/client/templates/errors/cqa_no_invite.js',
    'lib/client/templates/errors/cqa_no_rights.html',
    'lib/client/templates/errors/cqa_no_rights.js',
    'lib/client/templates/errors/cqa_not_found.html',
    'lib/client/templates/forms/cqa_urlCustomType.html',
    'lib/client/templates/forms/cqa_urlCustomType.js',
    'lib/client/templates/nav/cqa_logo.html',
    'lib/client/templates/nav/cqa_logo.js',
    'lib/client/templates/nav/cqa_mobile_nav.html',
    'lib/client/templates/nav/cqa_mobile_nav.js',
    'lib/client/templates/nav/cqa_header.html',
    'lib/client/templates/nav/cqa_header.js',
    'lib/client/templates/nav/cqa_submit_button.html'
  ], 'client');

  api.addAssets([
    'public/img/loading.svg',
  ], 'client');

  api.addFiles([
    'lib/server/CQA_start.js',
    'lib/server/CQA_fastrender.js',
    'lib/server/CQA_routes.js'
  ], ['server']);

  var CQA_languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  var CQA_languagesPaths = CQA_languages.map(function (language) {
    return "translation/"+language+".i18n.json";
  });
  api.addFiles(CQA_languagesPaths, ["client", "server"]);

});