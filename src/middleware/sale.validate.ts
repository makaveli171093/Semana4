import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

const saleItemSchema = z.object({
  id_product: z
    .number()
    .int()
    .positive("id_product debe ser un entero positivo"),
  quantity: z.number().int().positive("quantity debe ser mayor a 0"),
  unit_price: z.number().positive("unit_price debe ser un número positivo"),
});

export const createSaleSchema = z.object({
  id_customer: z.number().int().positive("id_customer es obligatorio"),
  items: z.array(saleItemSchema).min(1, "Debe incluir al menos un producto"),
});

export function validateSale(req: Request, res: Response, next: NextFunction) {
  const result = createSaleSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Datos de entrada inválidos",
      detalles: result.error.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensaje: issue.message,
      })),
    });
  }

  req.body = result.data;
  next();
}
