import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

export const productSchema = z.object({
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

export function validateProduct(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const resultado = productSchema.safeParse(req.body);
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
