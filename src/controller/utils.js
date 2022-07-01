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