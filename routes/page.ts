import express from 'express';

import{
	renderLogin, renderJoin, logout, renderProfile, renderUser, renderHome
} from '../controllers/page';
import{tokenCheck, idCheck} from '../middlewares/auth';

const router = express.Router();

router.get('/', renderHome);

router.get('/login', renderLogin);
router.get('/join', renderJoin);
router.get('/logout', logout);

router.get('/profile', tokenCheck, renderProfile);

router.get('/:id', tokenCheck, idCheck, renderUser)


export default router;