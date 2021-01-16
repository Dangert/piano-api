# Guess the Note (Server)

## Summary

A cool game for those who want to challenge their relative pitch!\nEach round, the player is given a random musical note (pitch) to find on the piano. The fewer guesses they make, the more points they win. They can try harder levels and win even more points.\nThe ten best scorers get a spot in the prestigious \"Top 10\".

## Database Tables

- `login` 
    ```
    id | hash | username
    ---+------+---------
    
    CREATE TABLE login (id serial PRIMARY KEY, hash varchar(100) NOT NULL, username text UNIQUE NOT NULL);
    ```

- `users`
  ```
  id | username | joined | total_score | total_games
  ---+----------+--------+-------------+------------
  
  CREATE TABLE users (id serial PRIMARY KEY, username text UNIQUE NOT NULL, joined TIMESTAMP NOT NULL, total_score INT DEFAULT 0, total_games INT DEFAULT 0);
  ```

## Run locally

- Clone repository and `cd` into local directory
- run `npm install`
- run `npm start`
