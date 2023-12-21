import express from 'express';

import{
	postUser, postLogin, putUser, deleteUser
} from '../controllers/auth';
import {tokenCheck} from '../middlewares/auth';

const router = express.Router();

router.post('/join', postUser);

router.post('/login', postLogin);

router.put('/:id', tokenCheck, putUser)

router.delete("/:id", tokenCheck, deleteUser)

export default router;