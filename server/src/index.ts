import { connectToDatabase } from "./database";
import checkEnv from "./initEnv";
import server from "./server";

const start = async () => {
    checkEnv();
    const db = await connectToDatabase();
    server(db);
};

start();
