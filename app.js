const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);

app.use(express.json());


app.get('/api/pokemon', function (req, res) {
  knex
    .select('*')
    .from('pokemon')
    .then(data => res.status(200).json(data))
    .catch(err =>
      res.status(404).json({
        message:
          'The data you are looking for could not be found. Please try again'
      })
    );
});

//result parse the json to pull out the content we want
async function getPokemon(poke) {
  let fetcher = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke}`)
  let result = await fetcher.json();
  let name = result.name;
  let poke_id = result.id;
  let type = result.types.type;
  let height = result.height;
  let weight = result.weight;
  let picture = result.url;
  let base_exp = result.base_experience;
  return name, poke_id, type, height, weight, picture, base_exp;



};



app.get('/api/:pokemon', (req, res) => {
  let pokemon = req.params.pokemon;
  //if in database return else fetch it
  knex
    .select('*')
    .from('pokemon')
    .where('name', pokemon)
    .then(data => {
      if (data.length > 0) {
        res.status(200).json(data)
      } else {
        // fetch to pokeapi/${pokemon}
        //come back to this
        //getPokemon(poke)
        getPokemon(pokemon)
          .then(response => {
            //come here first fuckers lol
            //let pokemon = response.data;
            knex('pokemon').insert({
              Poke_Id: poke_id,
              Name: name,
              Type: type,
              Base_Exp: base_exp,
              Height: height,
              Weight: weight,
              Picture: picture
            }).then(() => {
              res.status(200).json(pokemon);
            })
              .catch(err => {
                res.status(404)
              })
          })
          .end()
      }
    })
})


// table.integer('Poke_Id');//result.id
// table.string('Name').notNullable();//result.name
// table.string('Type');//result.types.type
// table.integer('Base_Exp');//result.base_experience
// table.integer('Height');//result.height
// table.integer('Weight');//result.weight
// table.string('Picture');//result.url


// knex and assign the data to the columns/attributes
// app.get('/api/:pokemon/img', (req, res) => {
//   //if in db return image else fetch API for it
//   fetch(pokeAPI + req.params.id)




// })


app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});