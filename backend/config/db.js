const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null
  };
}

async function connectDB() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing");
  }

  // Already connected
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // Connection is already being established
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000
      })
      .then((mongooseInstance) => {
        console.log("MongoDB connected");
        return mongooseInstance;
      })
      .catch((error) => {
        cached.promise = null;
        console.error("MongoDB connection error:", error.message);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;