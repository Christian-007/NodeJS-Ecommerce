var knex = require('knex');
var bookshelf = require('bookshelf');
var knexConfig = require('./knexfile');

module.exports = bookshelf(knex(knexConfig.development));