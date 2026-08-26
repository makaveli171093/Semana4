import express, { type Request, type Response } from "express";
import swaggerRouter from "./routes/swagger.router.js";
import cors from "cors";
import router from "./routes/product.router.js";

const port = process.env.PORT;

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.use("/api/docs", swaggerRouter);

app.use("/api", router);

app.listen(port, () => {
  console.log(`URL: http://localhost:${port}`);
});
