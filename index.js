'use strict';

var grpc = require('grpc');

var BASE_URL = 'bigtabletableadmin.googleapis.com';

var PROJECT_ID = 'nth-circlet-705';
var ZONE_ID = 'us-central1-b';
var CLUSTER_ID = 'stephen';

var bigtableAdminProto = grpc.load({
  root: __dirname,
  file: '/google/bigtable/admin/table/v1/bigtable_table_service.proto'
});

var TableAdmin = bigtableAdminProto.google.bigtable.admin.table.v1.BigtableTableService;

var client = new TableAdmin(BASE_URL, {
  credentials: grpc.Credentials.createDefault()
});

var clusterName =
  'projects/{project}/zones/{zone}/clusters/{cluster}'
    .replace('{project}', PROJECT_ID)
    .replace('{zone}', ZONE_ID)
    .replace('{cluster}', CLUSTER_ID);

var req = {
  name: clusterName
};

client.listTables(req, function (err, tables) {
  if (err) {
    console.error('Error!', err);
    return;
  }

  console.log('Tables!', tables);

  var tableName = tables.tables[0].name;

  client.getTable({
    name: tableName
  }, function (err, table) {
    if (err) {
      console.error(err);
      return;
    }

    console.log('Table!', table);
  });
});
