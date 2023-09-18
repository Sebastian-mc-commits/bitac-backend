import { config as dotenvConfig } from "dotenv";

dotenvConfig()

const { PORT } = process.env

export default {
  PORT
}