import { NextResponse } from "next/server";
import { connectDB } from "@/app/api/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SESSION_SECRET || "super_secret_key";

export async function GET() {
  try {
    const db = await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cookieStore = cookies() as any;
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let user: { login: string } | null = null;
    try {
      user = jwt.verify(sessionCookie.value, SECRET_KEY) as { login: string };
    } catch (err) {
      console.log(err);
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid session" }, { status: 403 });
    }

    const orders = await db.all(
      `SELECT orderID, storeID, totalPrice, orderTimestamp, orderStatus
       FROM FoodOrder
       WHERE login = ?
       ORDER BY orderTimestamp DESC`,
      [user.login]
    );

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
