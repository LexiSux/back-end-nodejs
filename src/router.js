import { Router } from 'express';
import UserCtrls from './controller/users';
import AuthController from './controller/auth';
import { AuthMiddleware } from './controller/utils';

const rtr = Router();


// --------------- users -------------------
rtr.use('/auth', AuthController);
rtr.use('/api/v1', AuthMiddleware);
rtr.use('/api/v1/users', UserCtrls);

export default rtr;