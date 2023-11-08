import mysql from 'mysql2/promise';
import configObj from '../config/config.js';
const state = process.env.NODE_ENV;
const config = configObj['test'];



const pool = mysql.createPool(config);

export default pool;