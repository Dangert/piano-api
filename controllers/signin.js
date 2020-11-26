const handleSignin = (db, bcrypt) => async (req, res) => {
  const { username, password } = req.body;
  let data, user;
  if (!username || !password) {
    return res.status(400).json('incorrect data submission');
  }
  // Verify username
  try {
    data = await db.one('SELECT * FROM login WHERE username = $1', [username]);
  }
  catch (error) {
    res.status(400).json('credentials error');
    return;
  }
  // Verify password
  const isValid = bcrypt.compareSync(password, data.hash);
  if (isValid) {
    // Get user
    try {
      user = await db.one('SELECT * FROM users WHERE username = $1', [username]);
      res.json(user);
    }
    catch (error) {
      res.status(400).json('fetch error');
      return;
    }
  }
  else {
    res.status(400).json('credentials error');
    return;
  }
}

module.exports = {
  handleSignin: handleSignin
}
