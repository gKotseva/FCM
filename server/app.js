import express from "express";
import cors from "cors";
import { db } from "./config/db.js";
import router from "./routes/router.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", router);

export default app;
