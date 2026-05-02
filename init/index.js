require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const initData = require("./data");

const MONGO_URL =
  process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function initDB() {
  try {
    // 🧹 Pehle existing connection close karo (important)
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }

    // 🔗 Fresh connection
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    // 🗑️ Old data delete
    await Listing.deleteMany({});

    // 📥 Insert new data
    const updatedData = initData.data.map((obj) => ({
      ...obj,
      owner: "697e2f2aa8eaf7ba9fac5c05",
      geometry: {
        type: "Point",
        coordinates: [77.1025, 28.7041],
      },
    }));

    await Listing.insertMany(updatedData);
    console.log("Data was initialized");

  } catch (err) {
    console.log(err);
  } finally {
    // 🔒 Connection close
    await mongoose.connection.close();
    console.log("Done");
  }
}

initDB();