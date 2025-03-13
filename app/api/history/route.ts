import { NextResponse } from "next/server";
import { connectDB } from "@/app/api/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SESSION_SECRET || "super_secret_key";

export async function GET(req: Request) {
  try {
    const db = await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cookieStore = cookies() as any;
    const session = cookieStore.get("session");

    let user: { login: string } | null = null;

    if (session) {
      try {
        user = jwt.verify(session.value, SECRET_KEY) as { login: string };
      } catch (err) {
        console.log(err);
      }
    } else {
      const authHeader = req.headers.get("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const token = authHeader.split(" ")[1];
          user = jwt.verify(token, SECRET_KEY) as { login: string };
        } catch (err) {
          console.log(err);
        }
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
