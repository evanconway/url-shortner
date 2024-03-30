import { Database } from 'sqlite';

const generateTables = async (db: Database) => {
    // user
    await db.run(`
        CREATE TABLE IF NOT EXISTS user (
            name     TEXT NOT NULL,
            password TEXT NOT NULL,
            id       TEXT NOT NULL
                        PRIMARY KEY
                        UNIQUE
        );
    `);

    // url
    await db.run(`
        CREATE TABLE IF NOT EXISTS url (
            original TEXT NOT NULL,
            short    TEXT NOT NULL,
            id       TEXT NOT NULL
                        PRIMARY KEY
                        UNIQUE,
            user_id  TEXT REFERENCES user (id) 
                        NOT NULL
        );
    `);
};

export default generateTables;
