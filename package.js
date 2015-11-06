Package.describe({
  name: 'constellation:dump-restore',
  version: '0.1.0',
  summary: 'Database dump/restore plugin for Constellation',
  git: 'https://github.com/JackAdams/constellation-dump-restore.git',
  documentation: 'README.md',
  debugOnly: true
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');

  api.use(['templating','blaze','underscore','reactive-dict'], 'client');
  api.use('constellation:console@1.3.0', 'client');
  api.use('juliancwirko:s-alert@3.1.1', 'client');

  api.addFiles('dump-restore.css', 'client');
  api.addFiles('dump-restore.html', 'client');
  api.addFiles('dump-restore.js', 'client');
  
  api.addFiles('dump-restore-server.js', 'server');
  
  api.imply('constellation:console');
});

Package.onTest(function(api) {
  api.use('tinytest');
});
