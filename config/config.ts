import dotenv from 'dotenv';

dotenv.config();

export default {
  development: {
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'crowdfunding',
    host: '127.0.0.1',
    dialect: 'mysql' as const,
  },
  test: {
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "crowdfunding",
    host: "127.0.0.1",
    dialect: "mysql" as const
  },
  production: {
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'crowdfunding',
    host: '127.0.0.1',
    dialect: 'mysql' as const,
    logging: false,
  },
};