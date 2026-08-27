import { Router } from "express";
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";
import {
  validateCustomer,
  validateUpdateCustomer,
  validateDeleteCustomer,
} from "../middleware/customer.validate.js";

const router: Router = Router();

router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);
router.post("/customers", validateCustomer, createCustomer);
router.put("/customers/:id", validateUpdateCustomer, updateCustomer);
router.delete("/customers/:id", validateDeleteCustomer, deleteCustomer);

export default router;
