const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const pgp = require('pg-promise')();

const signup = require('./controllers/signup');
const signin = require('./controllers/signin');
const users = require('./controllers/users');

const app = express();
// const db = pgp('postgres://dng2:dng2@localhost:5433/piano');
const cn = {
    connectionString: process.env.DATABASE_URL
};
const db = pgp(cn);
pgp.pg.defaults.ssl = {
  rejectUnauthorized: false
}
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res) => {res.send('app is running')})

/*{
  username: "",
  password: ""
}*/
app.post('/signin', signin.handleSignin(db, bcrypt));


/*{
  username: "",
  password: ""
}*/
app.post('/signup', signup.handleSignup(db, bcrypt));


/*{
  user_id: "",
  score: ""
}*/
app.post('/users/games/add', users.addGameToUser(db));


app.get('/users/games/:user_id', users.getUserStats(db));


app.get('/users/top/:number', users.getTopUsersRecords(db));


app.get('/users/exist/:username', users.userExist(db));


app.listen(process.env.PORT || 3000, () => {
  console.log("app is running on port " + process.env.PORT);
})


/*
CREATE TABLE users (id serial PRIMARY KEY, username text UNIQUE NOT NULL, joined TIMESTAMP NOT NULL, total_score INT DEFAULT 0, total_games INT DEFAULT 0);
INSERT INTO users(id, username, joined) VALUES ('125', 'dan', '2016-06-22 19:10:25-07');

CREATE TABLE login (id serial PRIMARY KEY, hash varchar(100) NOT NULL, username text UNIQUE NOT NULL);

CREATE TABLE games (id serial PRIMARY KEY, user_id serial NOT NULL, level text NOT NULL, score INT NOT NULL, created_at TIMESTAMP NOT NULL);
INSERT INTO games(id, user_id, level, score, created_at) VALUES (1, 'EASY', 3, '2016-06-22 19:10:25-07')

SELECT COUNT(Games.id) as total_games, SUM(Games.score) as total_score from (SELECT * FROM games WHERE user_id='11') AS Games;



*/
