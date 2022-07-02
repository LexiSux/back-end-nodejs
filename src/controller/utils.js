import {decode} from '../library/signer';
import m from 'mongoose';
import {Router, Request, Response, NextFunction} from 'express';
import {createModel} from '../model/utils';
/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {NextFunction} next 
 */
export const AuthMiddleware=(req, res, next)=>{

    const authHeader=process.env.AUTHHEADER || 'srawung-token';
    const aToken=req.headers[authHeader] || req.query?.token;
    if(!aToken)
    { 
        res.json({error:403, message:"Forbidden!"});
    }
    else
    {
        const start=new Date().getTime();
        res.set("before-token-timestamps", start);
        const uData=decode(aToken);
        
        const end=new Date().getTime();
        res.set("after-token-timestamps", end);
        res.set('token-time-ms',end - start);
        if(!uData)
        {
            res.json({error:401, message:'Auth Token Invalid or Expired!'});
        }
        else{
            res.locals.udata={...uData};
            res.locals.token=aToken;
            next();
        }
    }
}
/**
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} callback 
 */
export const CtrlHandler=async(req, res, callback)=>{
    let jres = {
        error:0,
        data:[],
        message:'',
        stack:{},
        errorName:''
    }
    const start=new Date().getTime();
    res.set("before-exec-timestamps", start);
    try {
        jres.data = await callback(req.body)
    } catch (error) {
        jres.error=500;
        jres.message=error.message;
        jres.stack = error.stack;
        jres.errorName = error.name;
    }
    if(jres.data!==undefined){
        const end=new Date().getTime();
        res.set("after-exec-timestamps", end);
        res.set('execution-time-ms',end - start);
        res.json(jres);
    }
}

/**
 * 
 * @param {m.Model} schema 
 * @param {Number} level 
 * @param {Array} defSearch 
 * @param {Function} beforeSaveData 
 * @param {Object} sort 
 * @param {Function} beforeRead 
 * @param {Function} beforeSendResult 
 * @param {Object} defFilter
 * @returns {Router}
 */
 export const createCrudController=( schema, level=0, defSearch=[], beforeSaveData=false, sort={_id:-1}, beforeRead=false, 
    beforeSendResult=false, defFilter={})=>{
    const rtr=Router();
    const {insert, reqPaging, update} = createModel(schema);
    rtr.get('/', (req, res)=>{
        CtrlHandler(req, res, async(body)=>{
            const {search, search2, page, perPage } = req.query;
            let filter={...defFilter};
            if(!!beforeRead && typeof beforeRead==='function'){
                filter = await beforeRead(search, search2, filter)
            }else{
                if(!!search){
                    const o=[];
                    const r=new RegExp(search,'i');
                    for (let iii = 0; iii < defSearch.length; iii++) {
                        const f = defSearch[iii];
                        o.push({[f]:r});
                    }
                    filter={...filter, $or:o};
                }else if(!!search2){
                    const f=JSON.parse(search2);
                    filter={...filter, ...f};
                }
            }
            return await reqPaging(schema, page, perPage, filter, sort)
        })
    })

    rtr.post('/', (req, res)=>{
        CtrlHandler(req, res, async(body)=>{
            const {level:lvl, _id:uid} = res.locals.udata;
            let data=body;
            if(!!beforeSaveData && typeof beforeSaveData==='function'){
                data = await beforeSaveData(data, lvl, uid);
            }
            if(level===0 || ((level&lvl)>0)){
                const {_id} = data;
                if(!!_id){
                    const result=await update(data, _id);
                    return (!!beforeSendResult && typeof beforeSendResult==='function' && await beforeSendResult(result, data)) || result;
                }
                const result = await insert(data, uid);
                return (!!beforeSendResult && typeof beforeSendResult==='function' && await beforeSendResult(result, data)) || result;
            }
            throw new Error('Error Privileges!');
        })
    })
    return rtr;
}