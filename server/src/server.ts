import express from "express";
import path from 'path';

export default () => {
    const app = express();

    // This code makes sure that any request that does not matches a static file
    // in the build folder, will just serve index.html. Client side routing is
    // going to make sure that the correct content will be loaded.
    app.use((req, res, next) => {
        if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
            next();
        } else {
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.header('Expires', '-1');
            res.header('Pragma', 'no-cache');
            res.sendFile(path.join(__dirname, '../../client/dist', 'index.html'));
        }
    });
    
    app.use(express.static(path.join(__dirname, '../../client/dist')));

    app.get('/greet', (req, res) => {
        res.send('hello world');
    });

    const port = 3000;

    app.listen(port, () => {
        console.log("app listening on port" + port);
    });
};
