import express from 'express';
import{
	postUser
} from '../controllers/auth';

const router = express.Router();

router.post('/join', postUser);


export default router;