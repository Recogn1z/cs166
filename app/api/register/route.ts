import { connectDB } from "../db";

export async function POST(req: Request) {
  try {
    const { login, password, phoneNum } = await req.json();

    // check empty
    if (!login || !password || !phoneNum) {
      return Response.json(
        { error: "you need to fill all blanks" },
        { status: 400 }
      );
    }

    const db = await connectDB();

    // check user exsist
    const existingUser = await db.get(
      "SELECT login FROM Users WHERE login = ?",
      [login]
    );

    if (existingUser) {
      return Response.json({ error: "duplicated username" }, { status: 409 });
    }

    // insert into db
    await db.run(
      "INSERT INTO Users (login, password, role, favoriteItems, phoneNum) VALUES (?, ?, 'customer', '', ?)",
      [login, password, phoneNum]
    );

    return Response.json({ message: "success!" });
  } catch (error) {
    console.error("failed", error);
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
