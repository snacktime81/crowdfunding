import express from 'express';
import{
	postUser, postLogin, putUser
} from '../controllers/auth';

const router = express.Router();

router.post('/join', postUser);

router.post('/login', postLogin);

router.put('/:id', putUser)


export default router;