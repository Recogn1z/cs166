import { NextResponse } from "next/server";
import { connectDB } from "@/app/api/db";

export async function GET() {
  try {
    const db = await connectDB();
    const stores = await db.all(
      "SELECT storeID, address, city, state, isOpen, reviewScore FROM Store"
    );

    return NextResponse.json({ stores });
  } catch (error) {
    console.error("❌ failed:", error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
