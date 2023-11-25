import express from 'express';
import{
	postUser, postLogin, putUser, deleteUser
} from '../controllers/auth';

const router = express.Router();

router.post('/join', postUser);

router.post('/login', postLogin);

router.put('/:id', putUser)

router.delete("/:id", deleteUser)


export default router;