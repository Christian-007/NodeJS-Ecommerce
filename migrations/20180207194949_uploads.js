
exports.up = function(knex, Promise) {
  return knex.schema.createTable('uploads', function(table) {
    table.increments();
    table.string('photo_name').notNullable();
    table.string('fullName').notNullable();
    table.string('filename').notNullable();
    table.integer('user_id').references('users.id');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('uploads');
};
