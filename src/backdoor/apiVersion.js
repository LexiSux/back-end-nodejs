import numeral from 'numeral';

export const Version = 1;
export const MajorVersion = 0;
export const MinorVersion = 0;
export const buildNumber = 0;
export const AppVersions = `${Version}.${MajorVersion}.${MinorVersion}.${numeral(buildNumber).format('0000')}`;

export const apiVersion = async (app) => {
    app.get('/version', (req, res) => {
    	res.json({ error: 0, data: `${AppVersions}` });
	});
}