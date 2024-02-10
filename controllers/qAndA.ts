import express from 'express';
import pool from "../models/db";
import { FieldPacket } from "mysql2/promise";
import jwt from 'jsonwebtoken';
import {qAndA} from "../types/model";
import {getUserToToken} from '../func/token'
import { CustomError } from '../types/error';


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

const renderFAQList: express.RequestHandler = async(req, res) => {
	let query = `SELECT f.faq_id, q.question 
				FROM FAQ f INNER JOIN Q_AND_A q
				ON f.qa_id = q.id;`;

	const [rows, fields]: [qAndA[], FieldPacket[]] = await pool.query(query);
    const FAQ = rows;

	res.render('FAQList', {items: FAQ});
}

const renderMyQAList: express.RequestHandler = async(req, res) => {
	try{
		const accessToken: string = req.cookies.accessToken;
		const user = await getUserToToken(accessToken);
		
		let query = "SELECT U.name as user_name, Q.id as QA_id, Q.question as question, Q.answer as answer FROM Q_AND_A AS Q INNER JOIN USER AS U ON(Q.user_id = U.id) WHERE user_id = (?);";

		if(!user || typeof user.id === 'undefined'){
			const error = new CustomError('User or User.id not found');
			throw(error);
		} else{
			const userId = user.id;
			const[qAndAs, fields]:[qAndA[], FieldPacket[]] = await pool.query(query, userId);
			console.log(qAndAs)
			res.status(200).render('userQAList', {qAndAs});
		} 

	} 
	catch(err){
		if(err instanceof CustomError){
			if(err.message === "user or User.id not found"){
				res.status(409).send('<script> alert("다시 로그인해 주세요"); location.href="/"; </script>')
			} else{
				res.status(500);
			}
		}
		else{
			res.status(500)
			console.log(err);
		}
	}
}

export { renderQAndA, postQAndA, renderQAndAId, renderQAndAList, renderFAQList, renderMyQAList }