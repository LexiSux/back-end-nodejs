import { createCrudController  } from './utils';
import POSTSCH from '../schema/post';

const beforeSendResult=(result)=>{
    const { title, ...less } = result;
    return less._doc;
}

const rtr=createCrudController(
				POSTSCH, // schema
				0, // level
				['title', 'body'], // defSearch
				'-title', // projection
				false, // beforeSaveData
				{_id:-1}, // sort
				false, // beforeRead
				beforeSendResult, // beforeSendResult
				{status: 'success'} // defFilter
);

export default rtr;