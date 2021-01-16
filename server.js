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
