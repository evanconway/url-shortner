import { Database as Sqlite3Database } from "sqlite3";
import { Database, open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';

const ABC = 'abcdefghijklmnopqrstuvwxyz1234567890';

export const connectToDatabase = async () => {
    const db = await open({ filename: 'sqlite-database.db', driver: Sqlite3Database });
    await db.run('CREATE TABLE IF NOT EXISTS user (name TEXT NOT NULL, password TEXT NOT NULL, id TEXT NOT NULL PRIMARY KEY UNIQUE);');
    await db.run('CREATE TABLE IF NOT EXISTS url (original TEXT NOT NULL, short TEXT NOT NULL, id TEXT NOT NULL PRIMARY KEY UNIQUE);');
    return db;
};

export const getUserData = async (db: Database) => {
    const rows = await db.all('Select * FROM user;');
    return rows;
};

export const addURLShort = async (db: Database, url: string) => {
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
    await db.run("INSERT INTO url (id, original, short) VALUES($id, $original, $short);", { $id: uuidv4(), $original: url, $short: key});
    return key;
};

export const getURLShorts = async (db: Database) => {
    return await db.all('SELECT original, short FROM url;');
};

export const getShortOriginalUrl = async (db: Database, short: string) => {
    const row = await db.get('SELECT original FROM url WHERE short = $key', { $key: short });
    return row['original'];
};
