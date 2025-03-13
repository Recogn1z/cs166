import { connectDB } from "../db";
import fs from "fs";
import path from "path";
import { parse } from "fast-csv";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATHS = {
  users: path.join(DATA_DIR, "users.csv"),
  items: path.join(DATA_DIR, "items.csv"),
  store: path.join(DATA_DIR, "store.csv"),
  foodOrder: path.join(DATA_DIR, "foodorder.csv"),
  itemsInOrder: path.join(DATA_DIR, "itemsinorder.csv"),
};

async function importCSVToDB(
  tableName: string,
  filePath: string,
  insertSQL: string
) {
  return new Promise((resolve, reject) => {
    const dbPromise = connectDB();

    if (!fs.existsSync(filePath)) {
      console.error(` ${filePath} skip`);
      resolve(false);
      return;
    }

    fs.createReadStream(filePath)
      .pipe(parse({ headers: true }))
      .on("data", async (row) => {
        try {
          const db = await dbPromise;
          await db.run(insertSQL, Object.values(row));
        } catch (err) {
          console.error(`❌ insert ${tableName} fail:`, err);
        }
      })
      .on("end", () => {
        console.log(`✅ ${tableName} finished！`);
        resolve(true);
      })
      .on("error", (err) => {
        console.error(`❌ analyse ${tableName} fail:`, err);
        reject(err);
      });
  });
}

export async function GET() {
  try {
    console.log("loading data...");

    await importCSVToDB(
      "Users",
      FILE_PATHS.users,
      "INSERT INTO Users (login, password, role, favoriteItems, phoneNum) VALUES (?, ?, ?, ?, ?)"
    );

    await importCSVToDB(
      "Items",
      FILE_PATHS.items,
      "INSERT INTO Items (itemName, ingredients, typeOfItem, price, description) VALUES (?, ?, ?, ?, ?)"
    );

    await importCSVToDB(
      "Store",
      FILE_PATHS.store,
      "INSERT INTO Store (storeID, address, city, state, isOpen, reviewScore) VALUES (?, ?, ?, ?, ?, ?)"
    );

    await importCSVToDB(
      "FoodOrder",
      FILE_PATHS.foodOrder,
      "INSERT INTO FoodOrder (orderID, login, storeID, totalPrice, orderTimestamp, orderStatus) VALUES (?, ?, ?, ?, ?, ?)"
    );

    await importCSVToDB(
      "ItemsInOrder",
      FILE_PATHS.itemsInOrder,
      "INSERT INTO ItemsInOrder (orderID, itemName, quantity) VALUES (?, ?, ?)"
    );

    return Response.json({ message: "success" });
  } catch (error) {
    console.error("fail", error);
    return Response.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
