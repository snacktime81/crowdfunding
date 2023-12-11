import jwt from 'jsonwebtoken';
import {payload} from "../types/model";


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

export {verify, isExpired}