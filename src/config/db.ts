import mongoose from "mongoose";
import config from "./config";

mongoose.set("strictQuery", false);
mongoose
  .connect(config.MONGO_URI as string)
  .then(() => console.log("Database is connected"))
  .catch((err) => console.log("Something went wrong: " + err.message));
