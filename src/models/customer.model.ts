import pool from "../config/db.js";

export interface Customer {
  id_customer: number;
  name: string;
  email: string;
  phone_number: string;
}

export const getAllCustomers = async (): Promise<Customer[]> => {
  const result = await pool.query(
    "SELECT id_customer, name, email, phone_number FROM customer ORDER BY id_customer ASC",
  );
  return result.rows;
};

export const getCustomerById = async (id: number): Promise<Customer | null> => {
  const result = await pool.query(
    "SELECT id_customer, name, email, phone_number FROM customer WHERE id_customer = $1",
    [id],
  );
  return result.rows[0] || null;
};

export const createCustomer = async (
  datos: Omit<Customer, "id_customer">,
): Promise<Customer> => {
  const { name, email, phone_number } = datos;
  const result = await pool.query(
    `INSERT INTO customer (name, email, phone_number)
     VALUES ($1, $2, $3)
     RETURNING id_customer, name, email, phone_number`,
    [name, email, phone_number],
  );
  return result.rows[0];
};

export const updateCustomer = async (
  id: number,
  datos: Partial<Omit<Customer, "id_customer">>,
): Promise<Customer | null> => {
  const clienteActual = await getCustomerById(id);
  if (!clienteActual) return null;

  const name = datos.name ?? clienteActual.name;
  const email = datos.email ?? clienteActual.email;
  const phone_number = datos.phone_number ?? clienteActual.phone_number;

  const result = await pool.query(
    `UPDATE customer
     SET name = $1, email = $2, phone_number = $3
     WHERE id_customer = $4
     RETURNING id_customer, name, email, phone_number`,
    [name, email, phone_number, id],
  );
  return result.rows[0] || null;
};
export const deleteCustomer = async (id: number): Promise<boolean> => {
  const result = await pool.query(
    "DELETE FROM customer WHERE id_customer = $1 RETURNING id_customer",
    [id],
  );
  return (result.rowCount ?? 0) > 0;
};
