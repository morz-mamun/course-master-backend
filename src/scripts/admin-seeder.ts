import User from "../models/User";
import { hashPassword } from "../utils/helpers";
import { connectDB } from "../config/database";
import config from "../config";

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = config.admin_email;
    const adminPassword = config.admin_password;

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("Admin user already exists");
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await hashPassword(adminPassword);
    const admin = new User({
      name: "Administrator",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Admin user created successfully");
    console.log(`Email: ${adminEmail}`);
    console.log("Password: Check your .env file");

    process.exit(0);
  } catch (error) {
    console.error("Seeder error:", error);
    process.exit(1);
  }
};

seedAdmin();
