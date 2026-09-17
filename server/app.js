import express from "express";
import cookieParser from "cookie-parser";

import router from "./router.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());
app.use(router);

export const server = app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

export default app;
