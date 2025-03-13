import { connectDB } from "../db";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const db = await connectDB();

    const schemaPath = path.join(process.cwd(), "schema.sql");
    const schemaSQL = fs.readFileSync(schemaPath, "utf-8");

    await db.exec(schemaSQL);

    return Response.json({ message: "Database initialized successfully!" });
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
