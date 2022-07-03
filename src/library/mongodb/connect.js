const dotenv = require('dotenv');
import m from 'mongoose';

dotenv.config();

// connect api
export const connectMongo = async (app) => {
    m.connect(process.env?.MONGOURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    if (process.env.DEV === 'true') {
    app.use('/', (req, res, next) => {
        res.set("Access-Control-Allow-Origin", '*')
        res.set("Access-Control-Allow-Methods", 'GET, POST, OPTIONS, HEAD')
        res.set("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, usefirebaseauth, srawungtoken, Accept, Develop-by, bb-token, User-Agent, Content-Disposition")
        res.set("Access-Control-Expose-Headers", '*');
        if (req.method.toLowerCase() === 'options') {
            res.end('OKE');
        }
        else {
            next();
        }
    });
}
}