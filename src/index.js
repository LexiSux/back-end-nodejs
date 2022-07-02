import express from 'express';
import fileUpload from 'express-fileupload';
import AppRouter from './router';
import path from 'path';
import dotenv from 'dotenv';
import helmet from 'helmet';
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

// security
app.disable( 'x-powered-by' ) ;
app.use( helmet.hsts( { maxAge: 7776000000 } ) ) ;
app.use( helmet.frameguard( 'SAMEORIGIN' ) ) ;
app.use( helmet.xssFilter( { setOnOldIE: true } ) ) ;
app.use( helmet.noSniff() ) ;

app.use((req, res, next) => {
    res.json({ error: 404, message: "failed to load api!" });
})

app.listen(process.env.PORT, process.env.IP, () => console.log(`server running on port ${process.env.PORT}, ip ${process.env.IP}`))
