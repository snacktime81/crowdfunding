import mysql from 'mysql2/promise';
import configObj from '../config/config.js';
const config = configObj['development'];


const pool = mysql.createPool(config);

export default pool;