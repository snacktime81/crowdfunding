import express from 'express';
import pool from "../models/db";
import { FieldPacket } from "mysql2/promise";
import jwt from 'jsonwebtoken';
import {user} from "../types/model";

import dotenv from 'dotenv';
dotenv.config();

const renderQAndA: express.RequestHandler = (req, res) => {
    res.render('qAndA');
}

const postQAndA: express.RequestHandler = async(req, res) => {
    try{
        const question = req.body.question;
        const query = "INSERT INTO Q_AND_A(user_id, question)  VALUES(?, ?);";
		
		const accessSecret = process.env.ACCESS_SECRET || "";
		const accessToken: string = req.cookies.accessToken;
		const tokenData: any = jwt.verify(accessToken, accessSecret);
		
		const userId = tokenData.id;
		const data = [userId , question]

        await pool.query(query, data);
        res.status(200);
		res.send(`<script> alert('질문이 정상적으로 등록되었습니다!'); location.href="/qAndA" </script>`);
    }
    catch(err){
        res.status(500);
        console.error(err);
    }
}

export { renderQAndA, postQAndA }