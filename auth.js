var GoogleAuth = require('google-auth-library');
var googleAuth = new GoogleAuth();

module.exports.getAuthClient = function(callback) {
  googleAuth.getApplicationDefault(function(err, authClient) {
    if (err) {
      callback(err);
      return;
    }

    if (authClient.createScopedRequired && authClient.createScopedRequired()) {
      authClient = authClient.createScoped([
        'https://www.googleapis.com/auth/bigtable.admin',
        'https://www.googleapis.com/auth/bigtable.admin.cluster',
        'https://www.googleapis.com/auth/bigtable.admin.table',
        'https://www.googleapis.com/auth/bigtable.data',
        'https://www.googleapis.com/auth/cloud-platform'
      ]);
    }

    callback(null, authClient);
  });
}

module.exports.getToken = function(callback) {
  module.exports.getAuthClient(function(err, authClient) {
    if (err) {
      callback(err);
      return;
    }

    authClient.getAccessToken(callback);
  });
}
