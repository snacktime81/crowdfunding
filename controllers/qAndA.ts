import express from 'express';
import pool from "../models/db";


const renderQAndA: express.RequestHandler = (req, res) => {
    res.render('qAndA');
}

export {renderQAndA}