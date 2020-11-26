const addGameToUser = (db) => async (req, res) => {
  const { user_id, score } = req.body;
  if (!user_id || score===null) {
    return res.status(400).json('incorrect data submission');
  }
  await db.none("UPDATE users SET total_score=total_score+$1, total_games=total_games+1 WHERE id=$2",
        [score, user_id]);
  res.json('success');
}

const getUserStats = (db) => async (req, res) => {
  const { user_id } = req.params;
  const gameStats = await db.one('SELECT total_score, total_games FROM users WHERE id = $1', [user_id]);
  res.json(gameStats);
}

const getTopUsersRecords = (db) => (req, res) => {
  const { number } = req.params;
  var topObj = {};
  db.tx(t => {
        return t.result('SELECT username, total_score, (SELECT CASE WHEN total_games=0 THEN 0 ELSE ROUND(total_score/total_games::numeric, 2) END AS avg) FROM users ORDER BY total_score DESC LIMIT $1',
        [number], r => r.rows)
        .then(by_score_records => {
          topObj['by_score'] = by_score_records;
          return t.result('SELECT username, total_score, (SELECT CASE WHEN total_games=0 THEN 0 ELSE ROUND(total_score/total_games::numeric, 2) END AS avg) FROM users ORDER BY avg DESC LIMIT $1',
          [number], r => r.rows)
          .then(by_avg_records => {
            topObj['by_avg'] = by_avg_records;
          })
      });
    })
    .then(() => {
      res.json(topObj);
    })
    .catch(error => {
      console.log(error);
        res.status(400).json('unable to get top records');
    });
}

const userExist = (db) => async (req, res) => {
  const { username } = req.params;
  const user = await db.oneOrNone('SELECT * from users where username=$1', [username]);
  if (user) {
    res.json({'exists': 'true'});
  }
  else {
    res.json({'exists': 'false'});
  }
}

module.exports = {
  addGameToUser: addGameToUser,
  getUserStats: getUserStats,
  getTopUsersRecords: getTopUsersRecords,
  userExist: userExist
}
