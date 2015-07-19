'use strict';

var assert = require('assert');
var async = require('async');

var Bigtable = require('./index.js');
var Table = require('./table.js');

var bigtable = new Bigtable({
  clusterId: 'stephen',
  projectId: 'nth-circlet-705',
  zoneId: 'us-central1-b'
});

var createdTableNames = [];

function generateTableName() {
  var tableName = 'new-table-' + Date.now();
  createdTableNames.push(tableName);
  return tableName;
}

function deleteTableByName(tableName, callback) {
  bigtable.table(tableName).delete(callback);
}

describe('Bigtable', function() {
  after(function(done) {
    async.each(createdTableNames, deleteTableByName, done);
  });

  it('should create a table', function(done) {
    var newTableName = generateTableName();

    bigtable.createTable(newTableName, function(err, table) {
      assert.ifError(err);
      assert(table instanceof Table);
      done();
    });
  });

  it('should list tables', function(done) {
    bigtable.getTables(function(err, tables) {
      assert.ifError(err);
      assert(tables.length > 0);
      done();
    });
  });
});
