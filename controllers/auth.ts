import {RequestHandler, Request, Response, NextFunction} from 'express';
import User from '../models/user';
import bcrypt from 'bcrypt';

const postUser: RequestHandler = async(req: Request, res: Response, next: NextFunction) => {
	try{
		const {nick, email, password, age} = req.body;
		
		const exUser = await User.findOne({ where: { email } });
		
		if(exUser){
			const url: string  = '/join?error=exist';
			return res.send(
				  `<script>
					alert('이미 존재하는 email입니다.');
					location.href='${url}';
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

export {postUser};