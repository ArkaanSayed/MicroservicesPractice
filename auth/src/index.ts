import mongoose from "mongoose";
import { app } from "./app";

app.listen(3000, async () => {
  console.log("Starting up...");
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to mongoDb");
    console.log("listening on port 3000!!!!");
  } catch (error) {
    console.error(error);
  }
});
