import express from 'express';
import{
	renderMain
} from '../controllers/page';

const router = express.Router();

router.get('/', renderMain);


export default router;