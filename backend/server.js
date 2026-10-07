require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

let readyPromise = null;

async function prepare() {
  if (!readyPromise) {
    readyPromise = (async () => {
      await connectDB();

      const email = (
        process.env.ADMIN_EMAIL || "admin@placementhub.com"
      ).toLowerCase();

      const exists = await User.findOne({ email });

      if (!exists) {
        const password = await bcrypt.hash(
          process.env.ADMIN_PASSWORD || "Admin@12345",
          10
        );

        await User.create({
          name: process.env.ADMIN_NAME || "Placement Administrator",
          email,
          password,
          role: "admin"
        });

        console.log("Default admin account created");
      }
    })();
  }

  return readyPromise;
}

// Prepare the database before Express handles a request
app.use(async (req, res, next) => {
  try {
    await prepare();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(500).json({
      message: "Database connection failed",
      error: error.message
    });
  }
});

// Local development
if (require.main === module) {
  const port = process.env.PORT || 5000;

  prepare()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
      });
    })
    .catch(error => {
      console.error("Startup failed:", error.message);
      process.exit(1);
    });
}

// Vercel uses the Express app directly
module.exports = app;