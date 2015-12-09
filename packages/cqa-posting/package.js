Package.describe({
  name: 'jyu103:cqa-posting',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Community Question Answering System Posting',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/BenjaminUJun/CommunityQASystem.git',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function (api) {

  api.versionsFrom(['METEOR@1.2']);

  api.use([
    'jyu103:cqa-lib@0.0.1',
    'jyu103:cqa-translation@0.0.1',
    'jyu103:cqa-settings@0.0.1',
    'jyu103:cqa-users@0.0.1',
    'jyu103:cqa-commenting@0.0.1'
  ]);

  api.addFiles([
    'lib/CQA_namespace.js',
    'lib/CQA_config.js',
    'lib/CQA_posts.js',
    'lib/CQA_parameters.js',
    'lib/CQA_views.js',
    'lib/CQA_helpers.js',
    'lib/CQA_modules.js',
    'lib/CQA_callbacks.js',
    'lib/CQA_methods.js',
    'lib/CQA_transitions.js',
    'lib/CQA_menus.js',
    'lib/CQA_routes.js'
  ], ['client', 'server']);

  api.addFiles([
    'lib/client/templates/between_post_item.html',
    'lib/client/templates/modules/cqa_post_actions.html',
    'lib/client/templates/modules/cqa_post_actions.js',
    'lib/client/templates/modules/cqa_post_admin.html',
    'lib/client/templates/modules/cqa_post_admin.js',
    'lib/client/templates/modules/cqa_post_author.html',
    'lib/client/templates/modules/cqa_post_author.js',
    'lib/client/templates/modules/cqa_post_avatars.html',
    'lib/client/templates/modules/cqa_post_avatars.js',
    'lib/client/templates/modules/cqa_post_comments_link.html',
    'lib/client/templates/modules/cqa_post_content.html',
    'lib/client/templates/modules/cqa_post_discuss.html',
    'lib/client/templates/modules/cqa_post_domain.html',
    'lib/client/templates/modules/cqa_post_domain.js',
    'lib/client/templates/modules/cqa_post_info.html',
    'lib/client/templates/modules/cqa_post_info.js',
    'lib/client/templates/modules/cqa_post_rank.html',
    'lib/client/templates/modules/cqa_post_rank.js',
    'lib/client/templates/modules/cqa_post_title.html',
    'lib/client/templates/modules/cqa_post_vote.html',
    'lib/client/templates/modules/cqa_post_vote.js',
    'lib/client/templates/cqa_post_body.html',
    'lib/client/templates/cqa_post_edit.html',
    'lib/client/templates/cqa_post_edit.js',
    'lib/client/templates/cqa_post_item.html',
    'lib/client/templates/cqa_post_item.js',
    'lib/client/templates/cqa_post_page.html',
    'lib/client/templates/cqa_post_page.js',
    'lib/client/templates/cqa_post_submit.html',
    'lib/client/templates/cqa_post_submit.js',
    'lib/client/templates/cqa_views_menu.html',
    'lib/client/templates/cqa_views_menu.js',
    'lib/client/templates/cqa_main_posts_list.html',
    'lib/client/templates/cqa_main_posts_list.js',
    'lib/client/templates/posts_list/cqa_posts_list.html',
    'lib/client/templates/posts_list/cqa_posts_list.js',
    'lib/client/templates/posts_list/cqa_posts_list_compact.html',
    'lib/client/templates/posts_list/cqa_posts_list_compact.js',
    'lib/client/templates/posts_list/cqa_posts_list_controller.html',
    'lib/client/templates/posts_list/cqa_posts_list_controller.js'
  ], ['client']);

  api.addFiles([
    'lib/server/CQA_publications.js',
    'lib/server/CQA_fastrender.js'
  ], ['server']);

  var CQA_languages = ["ar", "bg", "cs", "da", "de", "el", "en", "es", "et", "fr", "hu", "id", "it", "ja", "kk", "ko", "nl", "pl", "pt-BR", "ro", "ru", "sl", "sv", "th", "tr", "vi", "zh-CN"];
  var CQA_languagesPaths = CQA_languages.map(function (language) {
    return "translation/"+language+".i18n.json";
  });
  api.addFiles(CQA_languagesPaths, ["client", "server"]);

  api.export('CQAPostings');

});
