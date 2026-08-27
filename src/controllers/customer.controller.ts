import type { Request, Response } from "express";
import * as CustomerModel from "../models/customer.model.js";

export const getCustomers = async (_req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Customers']
    #swagger.summary = 'Obtener todos los clientes'
    #swagger.description = 'Retorna la lista completa de clientes registrados.'
  */
  try {
    const customers = await CustomerModel.getAllCustomers();
    return res.json(customers);
  } catch (error) {
    return res.status(500).json({ error: "Error al consultar clientes" });
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Customers']
    #swagger.summary = 'Obtener un cliente por ID'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID único del cliente',
      required: true,
      type: 'number',
      example: 1
    }
  */
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "ID de cliente inválido" });
    }

    const customer = await CustomerModel.getCustomerById(id);
    if (!customer) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    return res.json(customer);
  } catch (error) {
    return res.status(500).json({ error: "Error al consultar el cliente" });
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Customers']
    #swagger.summary = 'Crear un nuevo cliente'
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Datos del cliente a registrar',
      required: true,
      schema: {
        $name: 'Juan Pérez',
        $email: 'juan.perez@example.com',
        $phone_number: '71234567'
      }
    }
  */
  try {
    const nuevoCliente = await CustomerModel.createCustomer(req.body);
    return res.status(201).json(nuevoCliente);
  } catch (error) {
    return res.status(500).json({ error: "Error al crear el cliente" });
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Customers']
    #swagger.summary = 'Actualizar un cliente por ID'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del cliente a actualizar',
      required: true,
      type: 'number',
      example: 1
    }
    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Campos a actualizar del cliente',
      required: true,
      schema: {
        name: 'Juan Pérez Editado',
        email: 'juan.nuevo@example.com',
        phone_number: '77788999'
      }
    }
  */
  try {
    const id = Number(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: "ID de cliente inválido" });
    }

    const clienteActualizado = await CustomerModel.updateCustomer(id, req.body);
    if (!clienteActualizado) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    return res.json(clienteActualizado);
  } catch (error) {
    return res.status(500).json({ error: "Error al actualizar el cliente" });
  }
};
export const deleteCustomer = async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Customers']
    #swagger.summary = 'Eliminar un cliente por ID'
    #swagger.parameters['id'] = {
      in: 'path',
      description: 'ID del cliente a eliminar',
      required: true,
      type: 'number',
      example: 1
    }
  */
  try {
    const id = Number(req.params.id);
    console.log(id);
    const eliminado = await CustomerModel.deleteCustomer(id);
    console.log(eliminado);
    if (!eliminado) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }
    return res.json({ mensaje: "Cliente eliminado exitosamente" });
  } catch (error) {
    return res.status(500).json({ error: "Error al eliminar el cliente" });
  }
};
