import USERSCH from '../schema/users';
import { signer } from '../library/signer';
import crypto from 'crypto';
import m from 'mongoose';
import { reqPaging } from './utils';

const defaultUsername = 'admin';
const defaultEmail = 'admin@admin.com';
const defaultPhone = '08511111111111';
const defaultLevel = 0x1032;

const makeHashPassword = (password) => {
    const salt = process.env.SALT || 'SADHUWHENDMSABVHSACJASLWQPR';
    var hash = crypto.createHmac('sha256', salt);
    hash.update(password);
    return hash.digest('hex');
}

export const Login = async (username, password) => {
    const hashed = makeHashPassword(password);
    const uData = await USERSCH.findOne({ username, password: hashed }, '', { lean: true });
    if (!uData) {
        throw new Error(`User ${username} Not Found or Wrong Password!`);
    }
    const { password: pwd, ...less } = uData;
    const level = less.level;
    return [signer({ ...less, level }), uData];
}

export const getAll = async (level) => {
    return await USERSCH.find({ level: { $lte: level } }, '-password');
}

export const insert = async (data, uid) => {
    const { password: pwd, username, ...less } = data;

    const usr = await USERSCH.findOne({ username }, '', { lean: true });
    if (usr) throw new Error('username sudah digunakan!');

    const password = makeHashPassword(pwd);
    const resp = await USERSCH.create({ ...less, username, password, createdBy: m.Types.ObjectId(uid) });
    const { password: pwd2, ...result } = resp._doc;
    return result;
}

export const update = async (data, id) => {
    const { password, username, ...less } = data;

    const usr = await USERSCH.findOne({_id: m.Types.ObjectId(id), username }, '', { lean: true });

    if(usr){
        const resp = await USERSCH.findOneAndUpdate({ _id: m.Types.ObjectId(id) }, { $set: { ...less } }, {new:true});
        const { password: pwd2, ...result } = resp._doc;
        return result;
    } else {

         const usr = await USERSCH.findOne({ username }, '', { lean: true });
         if (usr) throw new Error('username sudah digunakan!');

        const resp = await USERSCH.findOneAndUpdate({ _id: m.Types.ObjectId(id) }, { $set: { ...less, username} }, {new:true});
        const { password: pwd2, ...result } = resp._doc;
        return result;

    }
}

export const updateProfile = async (userId, body) => {
    const { name, email, phone } = body;
    await USERSCH.updateOne({ _id: m.Types.ObjectId(userId) }, { $set: { name, email, phone } });
    const usr = await USERSCH.findOne({ _id: m.Types.ObjectId(userId) }, '', { lean: true });
    const { password, ...less } = usr;
    return signer(less);
}

export const changePassword = async (username, userId, password) => {
    const hashed = makeHashPassword(password);

    const correct = await USERSCH.findOne({ _id: m.Types.ObjectId(userId) });
    console.log(correct)
    if (!correct) throw new Error('Wrong Current Password!');
    return await USERSCH.updateOne({ username }, { $set: { password: hashed } });
}

export const createDefaultUser = async (password) => {
    const exists = await USERSCH.findOne({ username: defaultUsername });
    if (!!exists) throw new Error('User Default Exists!');
    return await createUser({ username: defaultUsername, level: defaultLevel, email :defaultEmail, phone: defaultPhone, password, name: 'Super User' });
}
export const createUser = async (userData) => {
    const { username, password, ...etc } = userData;
    const hashed = makeHashPassword(password);
    const resp = await USERSCH.create({ ...etc, username, password: hashed });
    const uData = await USERSCH.findOne({ _id: m.Types.ObjectId(resp._id)}, '-password -level', {lean:false, sort:{priority:1}});
    return uData;
}