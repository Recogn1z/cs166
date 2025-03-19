import { connectDB } from "@/app/api/db";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = await connectDB();

    const schemaPath = path.join(process.cwd(), "schema.sql");

    if (!fs.existsSync(schemaPath)) {
      return NextResponse.json(
        { error: "schema.sql not found" },
        { status: 500 }
      );
    }

    const schemaSQL = fs.readFileSync(schemaPath, "utf-8");
    await db.exec(schemaSQL);

    return NextResponse.json({ message: "Database initialized successfully!" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
