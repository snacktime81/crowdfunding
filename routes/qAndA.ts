import express from 'express';
import{
	renderQAndA, postQAndA
} from '../controllers/qAndA';

import{
	loginAuth, refreshToken, isLoggedIn, isNotLoggedIn, tokenCheck, renderQAndAId, renderQAndAList
} from '../controllers/auth';

const router = express.Router();

router.get('/', tokenCheck, renderQAndA);

router.post('/', tokenCheck, postQAndA);

router.get('/list', renderQAndAList)

router.get('/:id', renderQAndAId);


export default router;
