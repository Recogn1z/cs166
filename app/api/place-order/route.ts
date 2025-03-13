import { NextResponse } from "next/server";
import { connectDB } from "@/app/api/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SESSION_SECRET || "super_secret_key";

export async function POST(req: Request) {
  try {
    const db = await connectDB();
    const { storeID, items } = await req.json();

    if (!storeID) {
      return NextResponse.json({ error: "failed" }, { status: 400 });
    }

    // ✅ 解析 cookies
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
      return NextResponse.json({ error: "failed" }, { status: 401 });
    }

    const user = jwt.verify(session.value, SECRET_KEY) as { login: string };
    if (!user) {
      return NextResponse.json({ error: "invalid" }, { status: 403 });
    }

    let totalPrice = 0;
    for (const { itemName, quantity } of items) {
      const item = await db.get("SELECT price FROM Items WHERE itemName = ?", [
        itemName,
      ]);
      if (item) totalPrice += item.price * quantity;
    }

    // ✅ 事务处理
    await db.run("BEGIN TRANSACTION");

    const result = await db.run(
      "INSERT INTO FoodOrder (login, storeID, totalPrice, orderTimestamp, orderStatus) VALUES (?, ?, ?, ?, ?)",
      [user.login, storeID, totalPrice, new Date().toISOString(), "Pending"]
    );

    console.log("Insert result:", result);

    if (!result || !result.lastID) {
      await db.run("ROLLBACK");
      return NextResponse.json({ error: "insert failed" }, { status: 500 });
    }

    // ✅ 存入 ItemsInOrder
    for (const { itemName, quantity } of items) {
      await db.run(
        "INSERT INTO ItemsInOrder (orderID, itemName, quantity) VALUES (?, ?, ?)",
        [result.lastID, itemName, quantity]
      );
    }

    await db.run("COMMIT");

    return NextResponse.json({
      message: "successed",
      orderId: result.lastID,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "failed" }, { status: 500 });
  }
}
