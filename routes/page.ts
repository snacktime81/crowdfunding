import express from 'express';
import{
	renderMain, renderLogin, renderJoin, renderMain2, logout,
} from '../controllers/page';

import{
	loginAuth, isLoggedIn, isNotLoggedIn, refreshToken
} from '../controllers/auth';

const router = express.Router();


router.get('/', isNotLoggedIn, refreshToken, renderMain);
router.get('/', isLoggedIn, renderMain2);

router.get('/login', renderLogin);
router.get('/join', renderJoin);
router.get('/logout', logout);






export default router;