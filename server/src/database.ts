import { Database as Sqlite3Database } from "sqlite3";
import { Database, open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import generateTables from "./tableGenerate";

const saltRounds = 12;
const ABC = 'abcdefghijklmnopqrstuvwxyz1234567890';

/**
 * Connect to the database. Return a sqlite Database instance.
 * 
 * @returns 
 */
export const connectToDatabase = async () => {
    const db = await open({ filename: 'sqlite-database.db', driver: Sqlite3Database });
    await generateTables(db);
    return db;
};

export const getUserIdByUsername = async (db: Database, username: string) => {
    const row = await db.get('SELECT id FROM user WHERE name = $username', { $username: username });
    if (row === undefined) return null
    return row['id'] as string;
};

export const getUserIdByUsernamePassword = async (db: Database, username: string, password: string) => {
    const userId = await getUserIdByUsername(db, username);
    if (userId === null) return null;
    const passRow = await db.get('SELECT password FROM user WHERE id = $userId', { $userId: userId});
    if (passRow === undefined) return null;
    const hashedPassword = passRow['password'];
    if (hashedPassword === undefined) return null;
    const passMatch = await bcrypt.compare(password, hashedPassword);
    return passMatch ? userId : null;
};

/**
 * Create new user in user table with given username and password. Return new users userId if
 * successful, null otherwise.
 * 
 * @param db 
 * @param username 
 * @param password 
 * @returns 
 */
export const createUser = async (db: Database, username: string, password: string) => {
    try {
        const userId = uuidv4();
        const passwordHash = await bcrypt.hash(password, saltRounds);
        await db.run(
            'INSERT INTO user (id, name, password) VALUES($id, $name, $password)',
            { $id: userId, $name: username, $password: passwordHash },
        );
        return userId;
    } catch (err) {
        console.error(err);
    }
    return null;
};

export const getUserIdBySessionId = async (db: Database, sessionId: string) => {
    const row = await db.get('SELECT user_id FROM session WHERE id = $sessionId', { $sessionId: sessionId });
    if (row === undefined) return null;
    return row['user_id'] as string;
};

export const startSession = async (db: Database, userId: string) => {
    const key = uuidv4();
    try {
        await db.run('INSERT INTO session (id, user_id) VALUES($id, $userId)', { $id: key, $userId: userId});
        return key;
    } catch (err) {
        console.error(err);
    }
    return null;
};

export const endSession = async (db: Database, sessionId: string) => {
    try {
        await db.run('DELETE FROM session WHERE id = $sessionId', { $sessionId: sessionId });
        return true;
    } catch (err) {
        console.error(err);
    }
    return false;
};

/**
 * Return boolean indicating if the given username is already in the user table of the database.
 * 
 * @param db 
 * @param username 
 * @returns 
 */
export const getUsernameIsTaken = async (db: Database, username: string) => {
    const row = await db.get('SELECT * FROM user WHERE name = $username', { $username: username });
    return row !== undefined;
};

export const getUsernameByUserId = async (db: Database, userId: string) => {
    const row = await db.get('SELECT name FROM user WHERE id = $userId', { $userId: userId });
    const result = row['name'];
    if (result === undefined) return null;
    return result as string;
};

/**
 * Add shortened url entry. Return key of newly shortened url on success. Null otherwise.
 * 
 * @param db 
 * @param url 
 * @returns 
 */
export const addURLShort = async (db: Database, url: string, userId: string) => {
    // find better shortening system later
    let key = '';
    let shortExists = true;
    while (shortExists) {
        key = '';
        for (let i = 0; i < 5; i++) {
            key += ABC[Math.floor(Math.random() * ABC.length)];
        }
        const existingShort = await db.get('SELECT 1 FROM url WHERE short=$key', { $key: key });
        shortExists = existingShort !== undefined;
    }
    try {
        await db.run("INSERT INTO url (id, original, short, user_id) VALUES($id, $original, $short, $userId);", { $id: uuidv4(), $original: url, $short: key, $userId: userId});
    } catch (err) {
        console.error(err);
        return null;
    }
    return key;
};

/**
 * 
 * 
 * @param db 
 * @returns 
 */
export const getURLShortsByUserId = async (db: Database, userId: string) => {
    try {
        const rows = await db.all('SELECT original, short FROM url WHERE user_id = $userId;', { $userId: userId });
        return rows.map(row => ({
            original: row['original'],
            short: process.env['DOMAIN'] + '/s/' + row['short'],
        }));
    } catch (err) {
        console.log(err);
    }
    return null;
};

export const getShortOriginalUrl = async (db: Database, short: string) => {
    try {
        const row = await db.get('SELECT original FROM url WHERE short = $key', { $key: short });
        return row['original'];
    } catch (err) {
        console.log(err);
    }
    return null;
};
