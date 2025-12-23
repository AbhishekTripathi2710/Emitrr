import mysql from "mysql2/promise";

export const db = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"abhishek",
    database:"emitrr",
    waitForConnections: true,
    connectionLimit: 10
});