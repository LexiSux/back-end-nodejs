import { Router } from 'express';
import UserCtrls from './controller/users';
import AuthController from './controller/auth';
import { AuthMiddleware } from './controller/utils';

import PostCtrls from './controller/post';

const rtr = Router();

// --------------- router users -------------------
rtr.use('/auth', AuthController);
rtr.use('/api/v1', AuthMiddleware);
rtr.use('/api/v1/users', UserCtrls);

// --------------- router users -------------------
rtr.use('/api/v1/posts', PostCtrls);

export default rtr;