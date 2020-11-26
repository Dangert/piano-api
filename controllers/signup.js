const handleSignup = (db, bcrypt) => (req, res) => {
  saltRounds = 10; //bcrypt value
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json('incorrect data submission');
  }
  bcrypt.hash(password, saltRounds).then(hash => {
    db.tx(t => {
          // Create hash in DB
          return t.one('INSERT INTO login(username, hash) VALUES($1, $2) RETURNING *', [username, hash])
              .then(login => {
                // Create user in DB
                return t.one('INSERT INTO users(username, joined) VALUES($1, $2) RETURNING *', [login.username, new Date()]);
              });
      })
      .then(user => {
        res.json(user);
      })
      .catch(error => {
          res.status(400).json(error);
      });
  })
}

module.exports = {
  handleSignup: handleSignup
}
