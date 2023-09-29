import express from 'express';
import{
	renderQAndA, postQAndA
} from '../controllers/qAndA';

import{
	loginAuth, refreshToken, isLoggedIn, isNotLoggedIn, tokenCheck
} from '../controllers/auth';

const router = express.Router();

router.get('/', tokenCheck, renderQAndA);

router.post('/', tokenCheck, postQAndA);

export default router;
