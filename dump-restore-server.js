var Constellation = Package["constellation:console"].Constellation;

Meteor.methods({
  'Constellation.restoreCollections' : function (text) {
    return Constellation.restoreCollections(text);
  },
  'Constellation.dumpCollections' : function (collections) {
    return Constellation.dumpCollections(collections);
  }
});