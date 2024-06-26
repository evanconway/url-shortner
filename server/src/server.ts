import express, { Request, Response } from "express";
import path from 'path';
import { getShortOriginalUrl } from "./database";
import { Database } from "sqlite";
import { Database as Sqlite3Database, Statement } from "sqlite3";
import cookieParser from 'cookie-parser';
import { getAddURLFunc, getCreateAccountFunc, getGetUrlShortsFunc, getGetUsernameFromRequestFunc, getLoginFunc, getLogoutFunc, getUserIdFromRequest } from "./serverFunctions";

const staticFileDir = '../../client/dist';

const sendHTMLFile = (res: Response) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    res.sendFile(path.join(__dirname, staticFileDir, 'index.html'));
};

// serving static content with express:
// https://leejjon.medium.com/create-a-react-app-served-by-express-js-node-js-and-add-typescript-33705be3ceda
const isRequestForStatic = (req: Request) => {
    return /(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path);
};

export default async (db: Database<Sqlite3Database, Statement>) => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use(async (req, res, next) => {
        // if request is for shortened url, allow normal behavior
        if (req.path.startsWith('/s/') || req.path === '/app/login' || req.path === '/app/createaccount') next();
        else if (req.path === '/login' || req.path === '/createaccount') sendHTMLFile(res);
        else if (req.path === '/app/login' || req.path === '/app/createaccount') next();
        else if (isRequestForStatic(req)) next();
        else if (await getUserIdFromRequest(db, req) === null) res.redirect('/login');
        else if (!req.path.startsWith('/app/')) sendHTMLFile(res);
        else next(); // all other requests must be /app endpoints with valid sessionId, or explicit static file requests
    });

    /*
        From docs on express.static middleware:
        "The function determines the file to serve by combining req.url with the provided root directory. When a file
        is not found, instead of sending a 404 response, it calls next() to move on to the next middleware, allowing
        for stacking and fall-backs."
        So this middleware automatically takes care of serving .css, .js, and other explicitly requested files. But
        will continue to other defined endpoints if no such files exists.
        See above for explicitly serving the index.html file.
    */
    app.use(express.static(path.join(__dirname, staticFileDir)));

    app.post('/app/createaccount', getCreateAccountFunc(db));
    app.post('/app/login', getLoginFunc(db));
    app.get('/app/logout', getLogoutFunc(db));
    app.get('/app/view', getGetUrlShortsFunc(db));
    app.post('/app/create', getAddURLFunc(db));
    app.get('/app/username', getGetUsernameFromRequestFunc(db));
    app.get('/s/*', async (req, res) => res.redirect(await getShortOriginalUrl(db, req.path.slice(3))));

    const port = 3000;

    app.listen(port, () => {
        console.log(`app deployed at: http://localhost:${port}`);
    });
};
