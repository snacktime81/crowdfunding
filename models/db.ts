import mysql from 'mysql2/promise';
import configObj from '../config/config.js';
const config = configObj['development'];


const pool = mysql.createPool({
    host: config.host,
    user: config.name,
    password: config.password,
    database: config.database,
    connectionLimit: config.connectionLimit
})

export default pool;