import mysql from 'mysql2/promise';
import configObj from '../config/config.js';

import dotenv from 'dotenv';

dotenv.config();

const state = process.env.NODE_ENV;
const config = configObj[state];



const pool = mysql.createPool(config);

export default pool;