'use strict';

function Table(bigtable, name) {
  this.client_ = bigtable.client_;
  this.clusterName_ = bigtable.clusterName_;
  this.formattedName_ = this.formatName_(name);

  this.name = name;
  this.metadata = {};
}

Table.prototype.delete = function(callback) {
  this.client_.deleteTable({
    name: this.formattedName_
  }, callback);
};

Table.prototype.getMetadata = function(callback) {
  var self = this;

  this.client_.getTable({
    name: this.formattedName_
  }, function(err, table) {
    if (err) {
      callback(err);
      return;
    }

    self.metadata = table;
  });
};

Table.prototype.formatName_ = function(name) {
  if (name.indexOf('/') > -1) {
    return name;
  }

  return this.clusterName_ + '/tables/' + name;
};

module.exports = Table;
