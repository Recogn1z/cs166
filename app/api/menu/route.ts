import { NextResponse } from "next/server";
import { connectDB } from "@/app/api/db";

export async function GET() {
  try {
    const db = await connectDB();
    const menuItems = await db.all(
      "SELECT itemName, ingredients, typeOfItem, price, description FROM Items;"
    );

    return NextResponse.json({ menu: menuItems });
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}
