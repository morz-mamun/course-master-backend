export default {
  // Server
  node_env: process.env.NODE_ENV ?? "development",
  port: process.env.PORT ?? 5000,

  // Database
  database_url: process.env.DATABASE_URL as string,

  // JWT
  jwt_secret: process.env.JWT_SECRET as string,
  jwt_expire: (process.env.JWT_EXPIRES_IN ??
    "1d") as `${number}${"d" | "h" | "m"}`,

  // Bcrypt
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS ?? 10),

  // Admin Seeder
  admin_email: process.env.ADMIN_EMAIL as string,
  admin_password: process.env.ADMIN_PASSWORD as string,
};
