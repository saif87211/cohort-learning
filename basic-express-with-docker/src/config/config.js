import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export const config = {
    port: parseInt(process.env.PORT),
    dbUrl: String(process.env.DATABASE_URL),
    tokenSecret: String(process.env.TOKEN_SECRET),
    tokenExpiry: String(process.env.TOKEN_EXPIRY),
};