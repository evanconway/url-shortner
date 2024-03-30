import { Request, Response} from 'express';
import { Database } from 'sqlite';
import { addURLShort, createUser, getUsernameIsTaken } from './database';
import sessionManager from './sessionManager';

export const greet = (req: Request, res: Response) => {
        res.send('hello world');
};

export const getCreateAccountFunc = (db: Database) => {
    return async (req: Request, res: Response) => {
        const { username, password } = req.body;
        if (await getUsernameIsTaken(db, username)) {
            res.status(409).send({ msg: 'username taken' });
            return;
        }
        const userId = await createUser(db, username, password);
        if (!userId) {
            res.sendStatus(500);
            return;
        }
        const sessionId = sessionManager.startSession(userId);
        res.cookie('sessionId', sessionId).cookie('username', username);
        res.sendStatus(200);
    };
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
