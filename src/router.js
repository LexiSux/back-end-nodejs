import { Router } from 'express';
import ShcCtrls from './controller/user';

const rtr = Router();


// --------------- user -------------------
rtr.use('/api/v1/user', ShcCtrls);

export default rtr;