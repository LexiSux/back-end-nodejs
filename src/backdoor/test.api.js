import moment from 'moment';

export const testApi = async (app) => {
    app.get('/', (req, res) => {
    	res.json({ error: 0, data: moment().unix() });
	});
}