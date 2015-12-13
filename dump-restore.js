// Hook in to constellation UI

var API = Package["constellation:console"].API;
var Constellation = Package["constellation:console"].Constellation;
    
API.addTab({
  name: 'Dump/Restore',
  id: 'dump-restore',
  menuContentTemplate: 'Constellation_dump_restore_menu',
  mainContentTemplate: 'Constellation_dump_restore_main',
  guideContentTemplate: 'Constellation_dump_restore_guide'
});

DumpRestoreDict = new ReactiveDict('constellation-dump-restore');

sAlert.config({
    effect: '',
    position: 'top-left',
    timeout: 'none',
    html: true,
    onRouteClose: true,
    stack: true,
    offset: 0
});

var cannotDump = ["meteor_autoupdate_clientVersions", "meteor_accounts_loginServiceConfiguration"];

// Startup - retrieve the existing schema we've been working on from localStorage
Meteor.startup(function () {
  DumpRestoreDict.set('collectionsToDump', API.getCollections());
  // We have no way of knowing that sAlert has been rendered already
  // This will cause double alerts for apps with sAlert already rendered
  Blaze.render(Template['sAlert'], document.body);
});

Blaze.registerHelper('Constellation_dump_restoring', function () {
  return DumpRestoreDict.get('restoring');
});

Template.Constellation_dump_restore_menu.events({
  'click .Constellation_dump_restore_restore' : function (evt, tmpl) {
    var elem = $(evt.target).closest('.Constellation_row').find('.Constellation_dump_restore_restore_text');
	var text = elem.val();
	if (!text) {
	  alert('You need to paste the text from a collection dump here, then press \'Submit\'.');
	  return;	
	}
	var localCollectionsOnly = true;
	Constellation.restoreCollections(text, localCollectionsOnly);
	text = JSON.stringify(_.reduce(JSON.parse(text), function (memo, docs, collectionName) {
      if (!Constellation.collectionIsLocal(collectionName)) {
		memo[collectionName] = docs;  
	  }
      return memo;
	}, {}));
    Meteor.call('Constellation.restoreCollections', text, function (err, res) {
	  if (err || res) {
		if (err) {
		  err = JSON.stringify(err);
		}
		else {
		  err = res;
		}
	  }
	  if (err) {
		alert('Unable to restore collection(s) from the text supplied.\n\nError(s):' + err);  
	  }
	  else {	
        elem.val('');
        alert('Collection(s) restored.');  
	  }
    });
  },
  'click .Constellation_dump_restore_dump' : function (evt, tmpl) {
    var localCollectionsOnly = true;
    var localDump = Constellation.dumpCollections(DumpRestoreDict.get('collectionsToDump'), localCollectionsOnly);
	var mongoCollections = _.filter(DumpRestoreDict.get('collectionsToDump'), function (collectionName) { return !Constellation.collectionIsLocal(collectionName) && !_.contains(cannotDump, collectionName); });
    Meteor.call('Constellation.dumpCollections', mongoCollections, function (err, res) {
      // merge server collection and local collection dumps
	  var fullDump = JSON.stringify(_.extend(JSON.parse(res), JSON.parse(localDump)));
      sAlert.info('<textarea class="Constellation_dump_output">' + fullDump + '</textarea>');
      Meteor.defer(function () {
        $('textarea.Constellation_dump_output').select();
      });
	});
  },
  'click div[data-mode=dump], click div[data-mode=restore]' : function (evt, tmpl) {
    var mode = $(evt.target).data('mode');
	if (mode === 'dump' && !DumpRestoreDict.get('restoring')) {
	  var collectionsToDump = DumpRestoreDict.get('collectionsToDump');
	  collectionsToDump = _.difference(API.getCollections(), collectionsToDump);
      DumpRestoreDict.set('collectionsToDump', collectionsToDump);
	}
    DumpRestoreDict.set('restoring', (mode === 'restore') ? true : false);
	if (mode === 'restore') {
	  Tracker.flush();
      $(evt.target).closest('.Constellation_row').find('.Constellation_dump_restore_restore_text').focus();
	}
  }
});

Template.Constellation_dump_restore_main.helpers({
  dumpableCollections: function () {
    return _.filter(API.getCollections(), function (collection) { return !_.contains(cannotDump, collection); });
  },
  dumpCollection: function () {
    var collectionsToDump = DumpRestoreDict.get('collectionsToDump');
    return _.contains(collectionsToDump, String(this));
  }
});

Template.Constellation_dump_restore_main.events({
  'change input.Constellation_dump_collection_toggle' : function (evt, tmpl) {
    var collectionsToDump = DumpRestoreDict.get('collectionsToDump');
    if (_.contains(collectionsToDump, String(this))) {
      collectionsToDump = _.without(collectionsToDump, String(this));
    }
    else {
      collectionsToDump.push(String(this));    
    }
	DumpRestoreDict.set('collectionsToDump', collectionsToDump);
  }
});
    