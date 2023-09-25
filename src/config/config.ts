import { config as dotenvConfig } from "dotenv";

dotenvConfig()

const { PORT, JWT_SECRET, MONGO_URI, COOKIE_SECRET } = process.env

export default {
  PORT,
  JWT_SECRET,
  MONGO_URI,
  COOKIE_SECRET
}