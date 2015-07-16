var grpc = require('grpc');

var bigtable = grpc.load({
  root: __dirname,
  file: '/google/bigtable/v1/bigtable_service.proto'
});

console.log(Object.keys(bigtable.google.bigtable.v1))
