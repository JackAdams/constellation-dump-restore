Package.describe({
  name: 'constellation:dump-restore',
  version: '0.4.11',
  summary: 'Database dump/restore plugin for Constellation',
  git: 'https://github.com/JackAdams/constellation-dump-restore.git',
  documentation: 'README.md',
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom(['1.8.2', '2.3']);

  api.use(['templating@1.3.2', 'blaze@2.3.4', 'underscore', 'reactive-dict'], 'client');
  api.use('constellation:console@1.4.11', 'client');
  api.use('juliancwirko:s-alert@3.2.0', 'client');

  api.addFiles('dump-restore.css', 'client');
  api.addFiles('dump-restore.html', 'client');
  api.addFiles('dump-restore.js', 'client');
  
  api.addFiles('dump-restore-server.js', 'server');
  
  api.imply('constellation:console');
});

Package.onTest(function(api) {
  api.use('tinytest');
});
