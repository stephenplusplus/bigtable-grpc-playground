'use strict';

var grpc = require('grpc');
var Table = require('./table.js');

var BASE_URL = 'bigtabletableadmin.googleapis.com';

var bigtableAdminProto = grpc.load({
  root: __dirname,
  file: '/google/bigtable/admin/table/v1/bigtable_table_service.proto'
});

var TableAdmin = bigtableAdminProto.google.bigtable.admin.table.v1;
var TableAdminService = TableAdmin.BigtableTableService;

function Bigtable(options) {
  this.client_ = new TableAdminService(BASE_URL, {
    credentials: grpc.Credentials.createDefault()
  });

  this.clusterId_ = options.clusterId;
  this.projectId_ = options.projectId;
  this.zoneId_ = options.zoneId;

  this.clusterName_ = 'projects/{project}/zones/{zone}/clusters/{cluster}'
    .replace('{project}', this.projectId_)
    .replace('{zone}', this.zoneId_)
    .replace('{cluster}', this.clusterId_);
}

Bigtable.prototype.createTable = function(name, callback) {
  var self = this;

  this.client_.createTable({
    name: this.clusterName_,
    table_id: name
  }, function(err, table) {
    if (err) {
      callback(err);
      return;
    }

    var tableInstance = self.table(name);
    tableInstance.metadata = table;

    callback(null, tableInstance);
  });
};

Bigtable.prototype.getTables = function(callback) {
  var self = this;

  this.client_.listTables({
    name: this.clusterName_
  }, function (err, tables) {
    if (err) {
      callback(err);
      return;
    }

    var tableInstances = tables.tables.map(function(table) {
      var tableInstance = self.table(table.name);
      tableInstance.metadata = table;
      return tableInstance;
    });

    callback(null, tableInstances);
  });
};

Bigtable.prototype.table = function(name) {
  return new Table(this, name);
};

module.exports = Bigtable;
