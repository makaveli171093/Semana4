import type { Request, Response } from "express";
import {
  getAllProducts,
  getProductById,
  insertProduct,
  updateProduct as updateProductModel,
} from "../models/product.model.js";

export const getMenu = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Products']
    #swagger.summary = 'Obtener todos los productos del menú'
  */
  try {
    const products = await getAllProducts();
    return res.json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return res.status(500).json({ error: "Error al consultar el menú" });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Products']
    #swagger.summary = 'Obtener un producto por su ID'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'number'
    }
  */
  try {
    const id = Number(req.params.id);
    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    return res.json(product);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Products']
    #swagger.summary = 'Crear un nuevo producto'
    #swagger.parameters['body'] = {
      in: 'body',
      descript: 'Datos del nuevo producto',
      required: true,
      schema: {
        $name: 'Hamburguesa Clasica',
        $descript: 'Carne de res, queso cheddar y salsa especial',
        $price: 35.50,
        $available: 2
      }
    }
  */
  try {
    const { name, descript, price, available } = req.body;

    if (!name || !descript || price === undefined || available === undefined) {
      return res.status(400).json({
        error: "Todos los campos (name, descript, price) son obligatorios",
      });
    }

    const newProduct = await insertProduct(
      name,
      descript,
      Number(price),
      Number(available),
    );
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al crear producto:", error);
    return res.status(500).json({ error: "Error al guardar el producto" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Products']
    #swagger.summary = 'Actualizar un producto existente'
    #swagger.parameters['id'] = {
      in: 'path',
      required: true,
      type: 'number'
    }
    #swagger.parameters['body'] = {
      in: 'body',
      descript: 'Nuevos datos del producto',
      required: true,
      schema: {
        name: 'Hamburguesa Doble',
        descript: 'Doble carne de res con queso',
        price: 45.00,
        available: 2
      }
    }
  */
  try {
    const id = Number(req.params.id);
    const { name, descript, price, available } = req.body;

    const updatedProduct = await updateProductModel(
      id,
      name,
      descript,
      Number(price),
      Number(available),
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    return res.json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return res.status(500).json({ error: "Error al actualizar el producto" });
  }
};
