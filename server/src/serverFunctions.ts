import { Request, Response} from 'express';
import { Database } from 'sqlite';
import { addURLShort } from './database';

export const greet = (req: Request, res: Response) => {
        res.send('hello world');
};

export const getAddURLFunc = (db: Database) => {
    return async (req: Request, res: Response) => {
        try {
            const key = await addURLShort(db, req.body['urlInput']);
            res.sendStatus(200);
        } catch (err) {
            res.sendStatus(500);
        }
    };
};
