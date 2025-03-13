import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

const SECRET_KEY = process.env.SESSION_SECRET || "super_secret_key";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = verify(token, SECRET_KEY);
    return NextResponse.json({ user });
  } catch (error) {
    console.log(error);
  }
}
