import express from 'express';
import pool from "../models/db";
import { FieldPacket } from "mysql2/promise";
import jwt from 'jsonwebtoken';
import {user, qAndA} from "../types/model";

import dotenv from 'dotenv';
dotenv.config();

interface payload extends jwt.JwtPayload{
	id: number,
	email: string,
	name: string
}

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

const renderQAndAList: express.RequestHandler = async(req , res) => {

    const token = req.cookies.accessToken;
    const accessSecret = process.env.ACCESS_SECRET || "";
    const user: payload = jwt.verify(token, accessSecret) as payload;
    const userId = user.id;

	let query = "SELECT * FROM Q_AND_A WHERE user_id = (?);";
    const data = [userId];

	const [rows, fields]: [qAndA[], FieldPacket[]] = await pool.query(query, data);
    const qAndA = rows;

	res.render('qAndAList', {items: qAndA});
}

const renderQAndAId: express.RequestHandler = async(req, res) => {
    const {id} = req.params;
	
	let query = 'SELECT * FROM Q_AND_A WHERE id = (?)';
	const dataId = [id];

	const [rows, fields]:[qAndA[], FieldPacket[]] = await pool.query(query, dataId);
	const question = rows[0];
	
	res.render('qAndADetail', {question});
};

const renderFAQList = async(req, res) => {
	let query = "SELECT faq_id, question FROM FAQ;";

	const [rows, fields]: [qAndA[], FieldPacket[]] = await pool.query(query);
    const FAQ = rows;

	res.render('FAQList', {items: FAQ});
}

export { renderQAndA, postQAndA, renderQAndAId, renderQAndAList, renderFAQList }