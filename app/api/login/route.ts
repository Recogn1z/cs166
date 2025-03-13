import { NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { connectDB } from "@/app/api/db";

const SECRET_KEY = process.env.SESSION_SECRET || "super_secret_key";

export async function POST(req: Request) {
  try {
    const { login, password } = await req.json();
    const db = await connectDB();

    const user = await db.get("SELECT * FROM Users WHERE login = ?", [login]);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.password !== password) {
      return NextResponse.json(
        { error: "Incorrect password" },
        { status: 401 }
      );
    }

    const token = sign(
      { login: user.login, phoneNum: user.phoneNum },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    const response = NextResponse.json({ message: "Login successful!" });
    response.headers.set(
      "Set-Cookie",
      `session=${token}; HttpOnly; Path=/; Max-Age=3600; SameSite=Strict; Secure`
    );

    return response; //
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Database query failed" },
      { status: 500 }
    );
  }
}
