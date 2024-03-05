import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import {FieldPacket} from 'mysql2/promise';
import { TokenExpiredError } from 'jsonwebtoken';

import pool from "../models/db";
import {user, payload} from "../types/model";


const verify = (token: string, secret: string) => {
    try{    
		const data: payload = jwt.verify(token, secret) as payload;
		return data;
    }
	catch(err){
			return 'expired';
    }
}

const isExpired = (data: payload | 'expired'): data is 'expired' => {
	return data === 'expired';
}

const getUserToToken: (arg: string) => Promise<user | undefined> = async(accessToken) => {
	try{
		const accessSecret = process.env.ACCESS_SECRET || ""
		const data: payload = jwt.verify(accessToken, accessSecret) as payload;
		let query = "SELECT * FROM USER WHERE id = (?)";
		let dataId = [data.id]
		const [rows, fields] : [user[], FieldPacket[]] = await pool.query(query, dataId);
		const exUser: user = rows[0];
		return exUser
	}
	catch(err){
		if(err instanceof TokenExpiredError){
			console.log('token refresh');
		}
		else if(err instanceof JsonWebTokenError){
			console.log('need login')
		}
		else{
			console.log(err);
		}
	}
}

function makeJwt(id:string, secret: string): string {
	const token: string = jwt.sign({
		id: id,
	}, secret, {
		expiresIn: '5h',
	});
	return token
}

export {verify, isExpired, getUserToToken, makeJwt}