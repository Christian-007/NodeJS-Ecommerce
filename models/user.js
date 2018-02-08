var bookshelf = require('../bookshelf');
var Uploads = require('./uploads');

module.exports = bookshelf.Model.extend({
  tableName: 'users',
  uploads: function() {
    return this.hasMany(Uploads);
  }
});