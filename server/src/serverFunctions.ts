import { Request, Response} from 'express';
import { Database } from 'sqlite';
import { addURLShort, createUser, endSession, getURLShortsByUserId, getUserIdBySessionId, getUserIdByUsername, getUserIdByUsernamePassword, getUsernameByUserId, getUsernameIsTaken, startSession } from './database';

export const getLoginFunc = (db: Database) => {
    return async (req: Request, res: Response) => {
        const { username, password } = req.body;
        const userIdFromUsername = await getUserIdByUsername(db, username);
        if (userIdFromUsername === null) {
            res.status(401).send({ msg: 'no-account' });
            return;
        }
        const userId = await getUserIdByUsernamePassword(db, username, password);
        if (userId === null) {
            res.status(401).send({ msg: 'wrong-pass' });
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

export const getLogoutFunc = (db: Database) => {
    return async (req: Request, res: Response) => {
        const sessionId = req.cookies['sessionId'] as string;
        if (sessionId === null) {
            res.sendStatus(422);
            return;
        }
        await endSession(db, sessionId);
        res.cookie('sessionId', '').sendStatus(200);
    };
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
        const { username, password, repassword } = req.body;
        if (await getUsernameIsTaken(db, username)) {
            res.status(400).send({ msg: 'username is taken' });
            return;
        }
        if (password.length < 8) {
            res.status(400).send({ msg: 'password must be at least 8 characters' });
            return;
        }
        if (password !== repassword) {
            res.status(400).send({ msg: 'passwords do not match'});
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
