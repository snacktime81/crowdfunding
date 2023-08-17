import express from 'express';
import{
	postUser, postLogin
} from '../controllers/auth';

const router = express.Router();

router.post('/join', postUser);

router.post('/login', postLogin);


export default router;