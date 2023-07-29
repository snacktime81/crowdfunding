import {RequestHandler, Request, Response, NextFunction} from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const postUser: RequestHandler = async(req: Request, res: Response, next: NextFunction) => {
	try{
		const {nick, email, password, age} = req.body;
		
		const exUser = await User.findOne({ where: { email } });
		
		if(exUser){
			return res.send(
				  `<script>
					alert('이미 존재하는 email입니다.');
					location.href='/login';
				  </script>`
				);
		}
		const hash = await bcrypt.hash(password, 12);

		await User.create({
			email,
			nick,
			password: hash,
			age,
		});
		return res.redirect('/');
	}
	catch(err){
		console.error(err);
		return next(err);
	}
}

const postLogin: RequestHandler = async(req: Request, res: Response, next: NextFunction) => {
	try{
		const {email, password} = req.body;

		const exUser = await User.findOne({where: {email: email}})

		if(exUser){
			console.log(exUser)
			console.log(exUser.id)
			const accessSecret: string = process.env.ACCESS_SECRET || '';
			
			const accessToken = jwt.sign({
				id: exUser.id,
				email: exUser.email,
				nick: exUser.nick,
			}, accessSecret, {
				expiresIn: '5m',
				issuer: 'server',
			} );
			
			console.log(accessToken)
		}
		
		else{
			res.status(403);
			return res.send(
				  `<script>
					alert('없는 계정입니다.');
					location.href='/login';  
				  </script>`
				);
		}
		res.redirect('/')
	}
	catch(err){
		console.error(err);
		return next(err);
	}
}

export {postUser, postLogin};