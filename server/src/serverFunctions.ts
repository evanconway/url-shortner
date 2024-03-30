import { Request, Response} from 'express';
import { Database } from 'sqlite';
import { addURLShort, createUser, getURLShortsByUserId, getUserIdBySessionId, getUsernameByUserId, getUsernameIsTaken, startSession } from './database';

/**
 * Given a request, return the userId associated with the sessionId stored
 * in the cookies of the reqest. If there is no sessionId in the request,
 * or no valid userId associated with the contained sessionId, return
 * null instead.
 * 
 * @param db 
 * @param req 
 * @returns 
 */
export const getUserIdFromRequest = async (db: Database, req: Request) => {
    const sessionId = req.cookies['sessionId'] as string;
    if (sessionId === undefined) return null;
    const userId =  await getUserIdBySessionId(db, sessionId);
    if (userId === undefined) return null;
    return userId;
}; 

export const getGetUsernameFromRequestFunc = (db: Database) => {
    return async (req: Request, res: Response) => {
        // later we should make a new database function that gets this directly with a table join
        const userId = await getUserIdFromRequest(db, req);
        if (userId === null) {
            res.sendStatus(404);
            return;
        }
        const name = await getUsernameByUserId(db, userId);
        if (name === null) {
            res.sendStatus(404);
            return;
        }
        res.send(JSON.stringify(name));
    };
};

export const getCreateAccountFunc = (db: Database) => {
    return async (req: Request, res: Response) => {
        const { username, password } = req.body;
        if (await getUsernameIsTaken(db, username)) {
            res.status(409).send({ msg: 'name-taken' });
            return;
        }
        const userId = await createUser(db, username, password);
        if (!userId) {
            res.sendStatus(500);
            return;
        }
        const sessionId = await startSession(db, userId);
        if (sessionId === null) {
            res.sendStatus(500);
            return;
        }
        res.cookie('sessionId', sessionId);
        res.sendStatus(200);
    };
};

export const getAddURLFunc = (db: Database) => {
    return async (req: Request, res: Response) => {
        const userId = await getUserIdFromRequest(db, req);
        if (userId === null) {
            res.sendStatus(409);
            return;
        }
        try {
            await addURLShort(db, req.body['urlInput'], userId);
            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    };
};

export const getGetUrlShortsFunc = (db: Database) => {
    return async (req: Request, res: Response) => {
        const userId = await getUserIdFromRequest(db, req);
        if (userId === null) {
            res.sendStatus(409);
            return;
        }
        const urls = await getURLShortsByUserId(db, userId);
        if (urls === null) {
            res.sendStatus(500);
            return;
        }
        res.send(JSON.stringify(urls));
    };
};
