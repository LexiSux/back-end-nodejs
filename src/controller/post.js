import { createCrudController  } from './utils';
import POSTSCH from '../schema/post';
import moment from 'moment';
import { CreateRandomString } from '../library/utils';

const beforeSendResult=(result)=>{
    const { title, ...less } = result;
    return less._doc;
}

// example saving file upload
const beforeSaveData=(body, level, uid, req)=>{
    const { pict } = req.files;

    if(pict.size > 2000000){
        throw new Error(`reduce file size`);
    }

   	const [, ...rest] = pict.name.split('.');
    const ext = rest[rest.length - 1];
    const random = CreateRandomString(10);
    const name = `${moment().unix()}_${random}.${ext}`;
    pict.mv('static/transfer_evidence/' + name);

	const result = {...body, image: name};
    return result;

}

// crud component
const rtr=createCrudController(
		POSTSCH, // schema
		0, // level
		['title', 'body'], // defSearch
		'-title', // projection
		beforeSaveData, // beforeSaveData
		{_id:-1}, // sort
		false, // beforeRead
		beforeSendResult, // beforeSendResult
		{status: 'success'} // defFilter
);

export default rtr;