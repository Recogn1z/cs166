import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import fs from "fs";

export async function connectDB() {
  let dbPath: string;

  if (process.env.NODE_ENV === "production") {
    dbPath = "/tmp/database.db";
    if (!fs.existsSync(dbPath)) {
      fs.writeFileSync(dbPath, "");
    }
  } else {
    dbPath = path.join(process.cwd(), "mydb.sqlite");
  }

  return open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
}
