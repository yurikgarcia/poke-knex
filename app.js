const express = require('express');
const axios = require('axios');


const app = express();
const PORT = process.env.PORT || 3000;
const knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);

app.use(express.json());

//Random pokemon
app.get('/api/random', (req, res) => {
  const randomId = Math.floor(Math.random() * 100) + 1;
  console.log(randomId)
  axios
    .get(`https://pokeapi.co/api/v2/pokemon/${randomId}`)
    .then(response => {
      let pokemon = response.data;
      knex('pokemon').insert({
        Poke_Id: pokemon.id,
        Name: pokemon.name,
        Type: pokemon.types[0].type.name,
        Base_Exp: pokemon.base_experience,
        Height: pokemon.height,
        Weight: pokemon.weight,
        Picture: pokemon.sprites.front_default
      }).then(() => {
        res.status(200).send({
          Poke_Id: pokemon.id,
          Name: pokemon.name,
          Type: pokemon.types[0].type.name,
          Base_Exp: pokemon.base_experience,
          Height: pokemon.height,
          Weight: pokemon.weight,
          Picture: pokemon.sprites.front_default
        })
      })
    })
    .catch(err => {
      res.status(404).json({
        message: `The pokemon with ID of ${randomId} could not be found.`
      })
    })
})

//All Pokemon in the DB's name
app.get('/api/pokemon', function (req, res) {
  knex
    .select('Name')
    .from('pokemon')
    .then(data => res.status(200).json(data))
    .catch(err =>
      res.status(404).json({
        message:
          'The data you are looking for could not be found. Please try again'
      })
    );
});

//All Pokemon sorted by Base_Exp
app.get('/api/pokemon/exp', function (req, res) {

  knex
    .select('*')
    .from('pokemon')
    .orderBy('Base_Exp', 'desc')
    .then(data => res.status(200).json(data))
    .catch(err =>
      res.status(404).json({
        message:
          'The data you are looking for could not be found. Please try again'
      })
    );
});


//if in the DB show them else fetch
app.get('/api/:pokemon', (req, res) => {
  let pokemon = req.params.pokemon;
  //if in database return else fetch it
  knex
    .select('*')
    .from('pokemon')
    .where('Name', pokemon)
    .then(data => {
      if (data.length > 0) {
        res.status(200).json(data)
      } else {
        axios
          .get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
          .then(response => {
            let pokemon = response.data;
            knex('pokemon').insert({
              Poke_Id: pokemon.id,
              Name: pokemon.name,
              Type: pokemon.types[0].type.name,
              Base_Exp: pokemon.base_experience,
              Height: pokemon.height,
              Weight: pokemon.weight,
              Picture: pokemon.sprites.front_default
            }).then(() => {
              res.status(200).send({
                Poke_Id: pokemon.id,
                Name: pokemon.name,
                Type: pokemon.types[0].type.name,
                Base_Exp: pokemon.base_experience,
                Height: pokemon.height,
                Weight: pokemon.weight,
                Picture: pokemon.sprites.front_default
              });
            })
          })
          .catch(err => {
            res.status(404).json({
              message: `The pokemon you are looking for could not be found. Please try again`
            })
          })
      }
    })
})


//checks for image, if not in DB fetches API and stores
app.get('/api/:pokemon/img', (req, res) => {
  let pokemon = req.params.pokemon;
  //if in database return else fetch it
  knex
    .select('Picture')
    .from('pokemon')
    .where('Name', pokemon)
    .then(data => {
      if (data.length > 0) {
        res.status(200).json(data)
      } else {
        axios
          .get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
          .then(response => {
            let pokemon = response.data;
            knex('pokemon').insert({
              Poke_Id: pokemon.id,
              Name: pokemon.name,
              Type: pokemon.types[0].type.name,
              Base_Exp: pokemon.base_experience,
              Height: pokemon.height,
              Weight: pokemon.weight,
              Picture: pokemon.sprites.front_default
            }).then(() => {
              res.status(200).send({
                Poke_Id: pokemon.id,
                Name: pokemon.name,
                Type: pokemon.types[0].type.name,
                Base_Exp: pokemon.base_experience,
                Height: pokemon.height,
                Weight: pokemon.weight,
                Picture: pokemon.sprites.front_default
              });
            })
          })
          .catch(err => {
            res.status(404).json({
              message: `The pokemon you are looking for could not be found. Please try again`
            })
          })
      }
    })
})





app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});
