import express from 'express';
import{
	renderMainNotLoggedIn, renderLogin, renderJoin, renderMainLoggedIn, logout, renderQandA
} from '../controllers/page';

import{
	loginAuth, isLoggedIn, isNotLoggedIn, refreshToken
} from '../controllers/auth';

const router = express.Router();

router.get('/', isNotLoggedIn, refreshToken, renderMainNotLoggedIn);
router.get('/', isLoggedIn, renderMainLoggedIn);


router.get('/login', renderLogin);
router.get('/join', renderJoin);
router.get('/logout', logout);
router.get('/qAndA', renderQandA);

export default router;