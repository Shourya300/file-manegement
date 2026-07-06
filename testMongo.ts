import { MongoClient } from "mongodb";

const uri = "mongodb+srv://shouryasrivastava2006_db_user:nRoJlp1HwoHJKtzz@studentdash.pnwh1bt.mongodb.net/?appName=StudentDash";

async function test() {
  try {
    const client = new MongoClient(uri);

    await client.connect();

    console.log("✅ Connected Successfully!");

    const admin = client.db().admin();
    console.log(await admin.ping());

    await client.close();
  } catch (err) {
    console.error(err);
  }
}

test();