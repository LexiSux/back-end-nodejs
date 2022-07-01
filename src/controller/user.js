import { Router } from 'express';
import { CtrlHandler } from './utils';
import SHCSCH from '../schema/user';
import { createModel } from '../model/utils';

const rtr = Router();
const { insert, update, reqPaging } = createModel(SHCSCH);

rtr.get('/', (req, res) => {
    CtrlHandler(req, res, async (body) => {
        const { perPage, page, search } = req.query;
        let filter = {};
        if (search !== '') {
            const reg = new RegExp(search, 'i');
            filter = {
                $or: [
                    { nama: reg },
                ]
            }
        }
        return await reqPaging(SHCSCH, page, perPage, filter, { priority: -1, _id: -1 });
    })
});

rtr.get('/all', (req, res) => {
    CtrlHandler(req, res, async (body) => {
        return await SHCSCH.find({});
    })
})

rtr.post('/', (req, res) => {
    CtrlHandler(req, res, async (body) => {
        const { isCreate, _id: id, ...less } = body;
        const { _id, level } = res.locals.udata;
        if ((level & 0x1fff0) === 0) throw new Error('Error Privileged!');
        if (isCreate) {
            return await insert(less, _id);
        }
        return await update(less, id);
    })
});

export default rtr;