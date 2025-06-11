import { config } from "./config/config.js";
import { app } from "./app.js";
import { PrismaClient } from "./generated/prisma/client.js";


const port = config.port || 3000;

const prisma = new PrismaClient();

async function dbConnect() {
    try {
        await prisma.$connect();
        console.log(`🛢 Db Connected!!`);
    } catch (error) {
        console.log(`⚡ Db Connection failed wiht Prisma `, error);
        await prisma.$disconnect();
        throw error;
    }
}

dbConnect()
    .then(() => {
        app.on("error", (error) => {
            console.log("Error on App: ", error);
            throw error;
        });
        app.listen(port, () => console.log(`⚙ Server is burning hot on port:${port}!!!`));
    }).catch((error) => {
        console.log("Error on App: ", error);
        process.exit(1);
    });

export { prisma };