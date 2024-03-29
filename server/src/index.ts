import { connectToDatabase } from "./database";
import server from "./server";

const start = async () => {
    const db = await connectToDatabase();
    server(db);
};

start();
