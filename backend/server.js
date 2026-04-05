import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/tasks", taskRouter);

app.get("/", (req, res) => {
  res.send("API working");
});

// app.listen(PORT, () => {
//   connectDB();
//   console.log(`Server listening on port ${PORT}`);
// });

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
