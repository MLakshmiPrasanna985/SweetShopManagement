import dotenv from "dotenv";
import app from "./app";
import connectDB from "./config/db";

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("MONGO_URI not defined in environment variables");
}

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
