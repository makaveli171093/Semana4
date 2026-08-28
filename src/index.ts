import express, { type Request, type Response } from "express";
import swaggerRouter from "./routes/swagger.router.js";
import cors from "cors";
import routerProducts from "./routes/product.router.js";
import routerCustomers from "./routes/customer.router.js";
import routerSales from "./routes/sale.router.js";

const port = process.env.PORT;

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.use("/api/docs", swaggerRouter);

app.use("/api/products", routerProducts);
app.use("/api/customers", routerCustomers);
app.use("/api/sales", routerSales);

app.listen(port, () => {
  console.log(`URL: http://localhost:${port}`);
});
