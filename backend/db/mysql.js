import mysql from "mysql2/promise";

const sslConfig = process.env.MYSQL_SSL === "true" ? {
    rejectUnauthorized: process.env.MYSQL_SSL_REJECT_UNAUTHORIZED !== "false"
} : false;

export const db = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "abhishek",
    database: process.env.MYSQL_DATABASE || "emitrr",
    port: process.env.MYSQL_PORT ? parseInt(process.env.MYSQL_PORT) : 3306,
    ssl: sslConfig,
    waitForConnections: true,
    connectionLimit: 10
});