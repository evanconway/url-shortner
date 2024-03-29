import server from "./server";
import { Database } from "sqlite3";
import { open } from 'sqlite';

const start = async() => {
    const db = await open({ filename: 'sqlite-database.db', driver: Database });

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

    server();
};

start();
