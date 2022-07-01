import express from 'express';
import fileUpload from 'express-fileupload';
import AppRouter from './router';
import path from 'path';
import dotenv from 'dotenv';
import { apiVersion } from './backdoor/apiVersion';
import { testApi } from './backdoor/test.api';
import { connectMongo } from './library/mongodb/connect';
import { expressUpload } from './library/uploadfile/express-uploadfile';

const app = express();
dotenv.config();

testApi(app)
apiVersion(app)
connectMongo(app)
expressUpload(app, express)
app.use(AppRouter);

app.use((req, res, next) => {
    res.json({ error: 404, message: "failed to load api!" });
})

app.listen(process.env.PORT, process.env.IP, () => console.log(`server running on port ${process.env.PORT}, ip ${process.env.IP}`))
