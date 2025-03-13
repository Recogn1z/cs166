import { connectDB } from "../db";

export async function GET() {
  try {
    const db = await connectDB();

    const recentOrders = await db.all(
      "SELECT * FROM FoodOrder ORDER BY orderTimestamp DESC;"
    );

    return Response.json({ recentOrders });
  } catch (error) {
    console.error("❌ queries failed:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

//http://localhost:3000/api/testSQL
