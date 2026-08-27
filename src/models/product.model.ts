import pool from "../config/db.js";

export interface Products {
  id: number;
  name: string;
  descript: string;
  price: number;
  available: number;
}
export const getAllProducts = async (): Promise<Products[]> => {
  const result = await pool.query("SELECT * FROM product ORDER BY id ASC");
  return result.rows;
};

export const getProductById = async (id: number): Promise<Products | null> => {
  const result = await pool.query("SELECT * FROM product WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const insertProduct = async (
  name: string,
  descript: string,
  price: number,
  available: number,
): Promise<Products> => {
  const result = await pool.query(
    "INSERT INTO product (name, descript, price, available) VALUES ($1, $2, $3, $4) RETURNING *",
    [name, descript, price, available],
  );
  return result.rows[0];
};

export const updateProduct = async (
  id: number,
  name: string,
  descript: string,
  price: number,
  available: number,
): Promise<Products | null> => {
  const result = await pool.query(
    "UPDATE product SET name = $1, descript = $2, price = $3, available=$4 WHERE id = $5 RETURNING *",
    [name, descript, price, available, id],
  );
  return result.rows[0] || null;
};
export const deleteProduct = async (id: number): Promise<boolean> => {
  const resultado = await pool.query(
    "DELETE FROM product WHERE id = $1 RETURNING id",
    [id],
  );
  return (resultado.rowCount ?? 0) > 0;
};
