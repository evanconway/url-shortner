import express from "express";
import path from 'path';

const shortenedUrls = new Map<string, string>();

shortenedUrls.set('g', 'https://google.com');

export default () => {
    const app = express();

    /*
    from: https://leejjon.medium.com/create-a-react-app-served-by-express-js-node-js-and-add-typescript-33705be3ceda

    Need to spend more time understanding later. The regex expression seems to check if the path name ends in any
    of the static file extension names. We added the req.path.startsWith('/app') ourselves. So this means if a
    request asks for a static file, or doesn't start with /app, the express app will be handled by behavior defined
    later in the file. So all other requests are assumed to be requests for "theoretical" HTML files. But since
    this is a react app we want the client to handle that, so we just serve the single index.html.
    */
    app.use((req, res, next) => {
        const requestsStatic = /(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path);
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

    app.use(express.json());

    app.get('/app/greet', (req, res) => {
        res.send('hello world');
    });

    app.get('/app/view', (req, res) => {
        res.send(JSON.stringify(Object.fromEntries(shortenedUrls)));
    });

    app.post('/app/create', (req, res) => {
        // absolutely terrible strat for shortening url, but doing this for fun temporarily
        const abc = 'abcdefghijklmnopqrstuvwxyz';
        const getRandomChar = () => {
            return abc[Math.floor(Math.random() * abc.length)];
        };
        const randomKey = getRandomChar() + getRandomChar() + getRandomChar() + getRandomChar() + getRandomChar();
        shortenedUrls.set(randomKey, req.body['urlInput']);
        res.send('you got it');
    });

    app.get('/s/*', (req, res) => {
        const key = req.path.slice(3);
        const url = shortenedUrls.get(key);
        if (url === undefined) {
            res.send('unknown url :(');
            return;
        }
        res.redirect(url);
    });

    const port = 3000;

    app.listen(port, () => {
        console.log("app listening on port" + port);
    });
};
