import { Router } from "express";
import {
  getMenu,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import {
  validateProduct,
  validateDeleteProduct,
} from "../middleware/product.validate.js";

const routerProducts: Router = Router();

routerProducts.get("/menu", getMenu);
routerProducts.get("/menu/:id", getProduct);
routerProducts.post("/menu", validateProduct, createProduct);
routerProducts.put("/menu/:id", validateProduct, updateProduct);
routerProducts.delete("/menu/:id", validateDeleteProduct, deleteProduct);

export default routerProducts;
