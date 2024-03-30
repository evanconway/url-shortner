import express from "express";
import path from 'path';
import { getShortOriginalUrl, getURLShorts, getUserData } from "./database";
import { Database } from "sqlite";
import { Database as Sqlite3Database, Statement } from "sqlite3";
import { getAddURLFunc, greet } from "./serverFunctions";

const isRequestForStatic = (requestPath: string) => {
    return /(.ico|.js|.css|.jpg|.png|.map)$/i.test(requestPath);
};

const isLoginRequest = (requestPath: string) => {
    return requestPath === '/login' || requestPath === '/createaccount';
};

export default async (db: Database<Sqlite3Database, Statement>) => {
    const app = express();

    app.use(express.json());

    app.use((req, res, next) => {
        console.log('checking path:', req.path);
        if (isLoginRequest(req.path) || isRequestForStatic(req.path)) {
            next();
        } else if (req.body['sessionId'] === undefined) res.redirect('/login');
        else next();
    });

    /*
    from: https://leejjon.medium.com/create-a-react-app-served-by-express-js-node-js-and-add-typescript-33705be3ceda

    Need to spend more time understanding later. The regex expression seems to check if the path name ends in any
    of the static file extension names. We added the req.path.startsWith('/app') ourselves. So this means if a
    request asks for a static file, or doesn't start with /app, the express app will be handled by behavior defined
    later in the file. So all other requests are assumed to be requests for "theoretical" HTML files. But since
    this is a react app we want the client to handle that, so we just serve the single index.html.
    */
    app.use((req, res, next) => {
        const requestsStatic = isRequestForStatic(req.path);
        const isAPIEndpoint = req.path.startsWith('/app');
        const isShort = req.path.startsWith('/s/');
        if (requestsStatic || isAPIEndpoint || isShort) {
            next();
        } else {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
        }
    });
    
    // I believe this tells requests for static files to serve them from the given directory.
    // It explains why we can use default request behavior above for static files.
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('/app/greet', greet);
    app.get('/app/view', async (req, res) => res.send(JSON.stringify(await getURLShorts(db))));
    app.get('/app/unsafeuserdata', (req, res) => getUserData(db).then(v => res.send(v)));
    app.post('/app/create', getAddURLFunc(db));
    app.get('/s/*', async (req, res) => res.redirect(await getShortOriginalUrl(db, req.path.slice(3))));

    const port = 3000;

    app.listen(port, () => {
        console.log(`app deployed at: http://localhost:${port}`);
    });
};
