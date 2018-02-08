var bookshelf = require('../bookshelf');
// var User = require('./user');

var User = bookshelf.Model.extend({
  tableName: 'users'
});

module.exports = bookshelf.Model.extend({
  tableName: 'uploads',
  user: function() {
    return this.belongsTo(User);
  }
});