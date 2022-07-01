import fileUpload from 'express-fileupload';

export const expressUpload = async (app, express) => {
    app.use(express.static('static'));
    app.use(express.static('attachments'));
    app.use(express.json({ limit: '2MB' }));
    app.use(express.urlencoded({ extended: true }));
    app.use(fileUpload({ limits: { fileSize: (process.env?.FILELIMIT || 20) * 1024 * 1024 } }));
}