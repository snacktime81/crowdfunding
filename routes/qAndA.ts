import express from 'express';
import{
	renderQAndA
} from '../controllers/qAndA';

import{
	loginAuth, refreshToken, isLoggedIn, isNotLoggedIn
} from '../controllers/auth';

const router = express.Router();

router.get('/', renderQAndA)

export default router;
