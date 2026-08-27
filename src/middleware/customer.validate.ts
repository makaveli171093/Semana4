import type { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const createCustomerSchema = z.object({
  name: z
    .string({ message: "El campo name debe ser un texto" })
    .trim()
    .min(1, "El nombre no puede estar vacío"),
  email: z
    .string({ message: "El campo email debe ser un texto" })
    .trim()
    .email("El correo electrónico no es válido"),
  phone_number: z
    .string({ message: "El teléfono debe ser un texto" })
    .trim()
    .min(1, "El número de teléfono no puede estar vacío"),
});

export const updateCustomerSchema = createCustomerSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debes enviar al menos un campo para actualizar",
  });

export function validateCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = createCustomerSchema.safeParse(req.body);
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

export function validateUpdateCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = updateCustomerSchema.safeParse(req.body);

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
export function validateDeleteCustomer(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const id = Number(req.params.id);
  if (isNaN(id) || id <= 0) {
    return res
      .status(400)
      .json({ error: "Debes proporcionar un ID de cliente válido" });
  }
  next();
}
