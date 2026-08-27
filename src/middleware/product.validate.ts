import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const createProductSchema = z.object({
  name: z
    .string({ message: "el nombre debe ser string" })
    .trim()
    .min(1, "el nombre no puede ser vacio"),
  descript: z
    .string({ message: "la descripcion debe ser string" })
    .trim()
    .min(1, "la descripcion no puede ser vacia"),
  price: z
    .number({ message: "El precio debe ser un valor numérico" })
    .positive("El precio debe ser un número mayor a cero"),
  available: z
    .number({ message: "La disponibilidad debe ser un valor numérico" })
    .int("La disponibilidad debe ser un número entero")
    .min(0, "La disponibilidad debe ser mayor o igual a cero")
    .optional(),
});

export const updateProductSchema = createProductSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un dato para actualizar",
  });

export function validateCreateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const resultado = createProductSchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({
      error: "Datos de entrada inválidos",
      detalles: resultado.error.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensaje: issue.message,
      })),
    });
  }
  req.body = resultado.data;
  next();
}
export function validateUpdateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const resultado = updateProductSchema.safeParse(req.body);
  if (!resultado.success) {
    return res.status(400).json({
      error: "Datos de entrada inválidos",
      detalles: resultado.error.issues.map((issue) => ({
        campo: issue.path.join("."),
        mensaje: issue.message,
      })),
    });
  }
  req.body = resultado.data;
  next();
}
export function validateDeleteProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res
      .status(400)
      .json({ error: "Debes proporcionar un ID de producto válido" });
  }
  next();
}
