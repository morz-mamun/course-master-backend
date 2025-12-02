import config from "."

export const JWT_SECRET = config.jwt_secret || "secret-key-change-in-production"
export const JWT_EXPIRE = config.jwt_expire || "1d"

export const jwtConfig = {
  secret: JWT_SECRET,
  expiresIn: JWT_EXPIRE,
  cookieOptions: {
    httpOnly: true,
    secure: config.node_env === "production",
    sameSite: "strict" as const,
    maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
  },
}
