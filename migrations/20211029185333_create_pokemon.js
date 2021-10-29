exports.up = function (knex) {
  return knex.schema.createTable('pokemon', table => {
    table.increments('id'); // adds an auto incrementing PK column
    table.int('Poke_Id');//result.id
    table.string('Name').notNullable();//result.name
    table.string('Type');//result.types.type
    table.int('Base Exp');//result.base_experience
    table.int('Height');//result.height
    table.int('Weight');//result.weight
    table.string('Picture');//result.url
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('pokemon');
};