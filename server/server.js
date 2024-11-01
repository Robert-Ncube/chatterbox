import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import AllRoutes from "./routes/AllRoutes.js";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { app, httpServer } from "./socket/socket.js";

dotenv.config();

//deployment*
import path from "path";
const __dirname = path.resolve();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/api", AllRoutes);

//deployment*
// Serve static assets in production
app.use(express.static(path.join(__dirname, "client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client/dist/index.html"));
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => console.log(err));
