import { Router } from "express";
import {
  getMenu,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import {
  validateCreateProduct,
  validateDeleteProduct,
  validateUpdateProduct,
} from "../middleware/product.validate.js";

const routerProducts: Router = Router();

routerProducts.get("/menu", getMenu);
routerProducts.get("/menu/:id", getProduct);
routerProducts.post("/menu", validateCreateProduct, createProduct);
routerProducts.put("/menu/:id", validateUpdateProduct, updateProduct);
routerProducts.delete("/menu/:id", validateDeleteProduct, deleteProduct);

export default routerProducts;
