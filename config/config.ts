import dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'crowdfunding',
    host: '127.0.0.1',
    connectionLimit: 30,
  },
  test: {
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "crowdfunding",
    host: "127.0.0.1",
    connectionLimit: 30,
  },
  production: {
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'crowdfunding',
    host: '127.0.0.1',
    connectionLimit: 30,
    logging: false,
  },
};