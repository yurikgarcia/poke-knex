exports.up = function (knex) {
  return knex.schema.createTable('pokemon', table => {
    table.increments('id'); // adds an auto incrementing PK column
    table.integer('Poke_Id');//result.id
    table.string('Name').notNullable();//result.name
    table.string('Type');//result.types.type
    table.integer('Base_Exp');//result.base_experience
    table.integer('Height');//result.height
    table.integer('Weight');//result.weight
    table.string('Picture');//result.url
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('pokemon');
};