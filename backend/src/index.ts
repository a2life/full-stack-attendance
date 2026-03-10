import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import memberRoutes from "./routes/members";
import eventSheetRoutes from "./routes/eventSheets";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/attendance_db";

app.use(cors());
app.use(express.json());

app.use("/api/members", memberRoutes);
app.use("/api/eventsheets", eventSheetRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const connectWithRetry = () => {
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB");
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err: Error) => {
      console.error("MongoDB connection error, retrying in 5s...", err.message);
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();
