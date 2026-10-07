require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

let ready = false;

async function prepare() {
  if (ready) return;

  await connectDB();

  const email = (process.env.ADMIN_EMAIL || "admin@placementhub.com").toLowerCase();
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

  ready = true;
}

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

module.exports = async (req, res) => {
  try {
    await prepare();
    return app(req, res);
  } catch (error) {
    return res.status(500).json({
      message: "Database connection failed",
      error: error.message
    });
  }
};
