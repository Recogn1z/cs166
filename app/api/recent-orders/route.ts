import { NextResponse } from "next/server";
import { connectDB } from "@/app/api/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SESSION_SECRET || "super_secret_key";

export async function GET() {
  try {
    const db = await connectDB();

    const cookieStore = cookies();
    const session = await cookieStore.get("session");

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = jwt.verify(session.value, SECRET_KEY) as { login: string };
    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 403 });
    }

    const orders = await db.all(
      "SELECT orderID, storeID, totalPrice, orderTimestamp, orderStatus FROM FoodOrder WHERE login = ? ORDER BY orderTimestamp DESC LIMIT 5",
      [user.login]
    );

    return NextResponse.json({ orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch recent orders" },
      { status: 500 }
    );
  }
}
