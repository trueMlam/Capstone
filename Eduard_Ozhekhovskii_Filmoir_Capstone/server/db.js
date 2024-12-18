const { MongoClient } = require("mongodb");

let client;

async function connectToDB() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI, {
    });

    try {
      await client.connect();
      console.log("✅ connected to db");
    } catch (err) {
      console.error("❌ db failed", err);
      throw new Error("❌ db failed");
    }
  }
  return client.db();
}

async function closeDBConnect() {
  if (client) {
    await client.close();
    console.log("db closed");
  }
}

module.exports = { connectToDB, closeDBConnect };