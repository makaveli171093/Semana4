import type { Request, Response } from "express";
import * as SaleModel from "../models/sale.model.js";

export const getSales = async (_req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Sales']
    #swagger.summary = 'Obtener todas las ventas con el nombre del cliente'
  */
  try {
    const sales = await SaleModel.getAllSales();
    return res.json(sales);
  } catch (error) {
    return res.status(500).json({ error: "Error al consultar las ventas" });
  }
};

export const getSaleById = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Sales']
    #swagger.summary = 'Obtener una venta por ID'
    #swagger.parameters['id'] = { in: 'path', type: 'number', required: true }
  */
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "ID de venta inválido" });
    }

    const sale = await SaleModel.getSaleById(id);
    if (!sale) {
      return res.status(404).json({ error: "Venta no encontrada" });
    }

    return res.json(sale);
  } catch (error) {
    return res.status(500).json({ error: "Error al consultar la venta" });
  }
};

export const createSale = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Sales']
    #swagger.summary = 'Registrar una venta con items (Transacción)'
    #swagger.parameters['body'] = {
      in: 'body',
      required: true,
      schema: {
        $id_customer: 7,
        $items: [
          { $id_product: 10, $quantity: 2, $unit_price: 25.00 },
          { $id_product: 12, $quantity: 2, $unit_price: 5.00 }
        ]
      }
    }
  */
  try {
    const nuevaVenta = await SaleModel.createSaleWithTransaction(req.body);
    return res.status(201).json(nuevaVenta);
  } catch (error) {
    console.error("❌ Error en la transacción de la venta:", error);
    return res.status(500).json({ error: "Error al registrar la venta" });
  }
};
