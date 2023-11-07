require('dotenv').config();

module.exports = {
  development: {
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'startfunding',
    host: '127.0.0.1',
    connectionLimit: 30,
  },
  test: {
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "startfunding_test",
    host: "127.0.0.1",
    connectionLimit: 30,
  },
  production: {
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'startfunding',
    host: '127.0.0.1',
    connectionLimit: 30,
    logging: false,
  },
};