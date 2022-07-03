import { Router } from 'express';
import { AuthMiddleware, CtrlHandler } from './utils';
import { refreshToken } from '../library/signer';
import { createLog } from '../library/activity_log';
import { changePassword, createDefaultUser, Login, updateProfile } from '../model/users';

const rtr = Router();

rtr.use('/logout', AuthMiddleware);
rtr.use('/refreshToken', AuthMiddleware);
rtr.use('/changePassword', AuthMiddleware);
rtr.use('/me', AuthMiddleware);

// create default user
rtr.post('/createDefaultUser', (req, res) => {
    CtrlHandler(req, res, async (body) => {
        const { password } = body;
        return await createDefaultUser(password);
    });
});

// login
rtr.post('/login', (req, res) => {
    CtrlHandler(req, res, async (body) => {
        const { app } = req.query;
        const { username, password } = body;
        try {
            const [token, udata] = await Login(username, password);
            const { level } = udata;
            switch (app) {
                case 'level1':
                    if ((level & 0x1032) === 0) throw new Error('User not found!');
                    break;
                case 'level2':
                    if ((level & 0x1031) === 0) throw new Error('User not found!');
                    break;
                default:
                    throw new Error("Apps Not Found!");
            }
            createLog(udata._id, `Login Success For User ${username}`, req);
            return token;
        } catch (error) {
            createLog(undefined, `Login Failed For User ${username}`, req);
            throw error;
        }
    });
});

// refresh token
rtr.get('/refreshToken', (req, res) => {
    CtrlHandler(req, res, async (body) => {
        return refreshToken(res.locals.token);
    });
});


// check token
rtr.get('/me', (req, res) => {
    CtrlHandler(req, res, async (body) => {
        return res.locals.udata;
    });
});

// change password
rtr.post('/changePassword', (req, res) => {
    CtrlHandler(req, res, async (body) => {
        const { username, _id } = res.locals.udata;
        const { password } = body;
        const resp = await changePassword(username, _id, password);
        createLog(_id, `Change password for ${username}`, req);
        return password;
    });
});

// logout
rtr.get('/logout', (req, res) => {
    CtrlHandler(req, res, async (body) => {
        const { _id: user_id, username } = res.locals.udata;
        createLog(user_id, `${username} Logout`, req);
        return true;
    });
});

export default rtr;