import { Database as Sqlite3Database, Statement } from "sqlite3";
import { Database, open } from 'sqlite';

const ABC = 'abcdefghijklmnopqrstuvwxyz1234567890';

export const connectToDatabase = async () => {
    const db = await open({ filename: 'sqlite-database.db', driver: Sqlite3Database });
    await db.run('CREATE TABLE IF NOT EXISTS "user" (name TEXT NOT NULL, password TEXT NOT NULL);');
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
    await db.run("INSERT INTO url (original, short) VALUES($original, $short);", { $original: url, $short: key});
    return key;
};

export const getURLShorts = async (db: Database) => {
    return await db.all('SELECT * FROM url;');
};

/*
// create user table
await db.run('CREATE TABLE IF NOT EXISTS "user" (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, password TEXT NOT NULL, CONSTRAINT user_id PRIMARY KEY (id) );')

await db.run("CREATE TABLE IF NOT EXISTS lorem (info TEXT);");

const existingRows = await db.all('SELECT 1 FROM lorem;');

if (existingRows.length <= 0) {
    for (let i = 0; i < 10; i++) await db.run('INSERT INTO lorem VALUES ($info)', { $info: 'Ipsum ' + i });
}

await db.each("SELECT rowid AS id, info FROM lorem", (err, row: { id: string, info: string }) => {
    console.log(row.id + ": " + row.info);
});

const check = await db.get('SELECT rowid AS id, info FROM lorem');
console.log(check);
*/