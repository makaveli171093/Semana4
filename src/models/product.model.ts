import pool from "../config/db.js";

export interface Products {
  id: number;
  name: string;
  descript: string;
  price: number;
  available: number;
}
export interface ProductQueryFilters {
  maxPrice?: number;
  page?: number;
  limit?: number;
}
export const getAllProducts = async (
  filters: ProductQueryFilters,
): Promise<Products[]> => {
  const { maxPrice, page = 1, limit = 10 } = filters;
  const values: any[] = [];
  const conditions: string[] = [];

  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    values.push(maxPrice);
    conditions.push(`price <= $${values.length}`);
  }

  let baseQuery = "SELECT id, name, descript, price, available FROM product";
  if (conditions.length > 0) {
    baseQuery += ` WHERE ${conditions.join(" AND ")}`;
  }

  const offset = (page - 1) * limit;

  values.push(limit);
  const limitParamIndex = values.length;

  values.push(offset);
  const offsetParamIndex = values.length;

  baseQuery += ` ORDER BY name ASC LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex}`;
  console.log("SQL Query:", baseQuery);
  console.log("valores:", values);

  const result = await pool.query(baseQuery, values);
  return result.rows;
};

export const getProductById = async (id: number): Promise<Products | null> => {
  const result = await pool.query("SELECT * FROM product WHERE id = $1", [id]);
  return result.rows[0] || null;
};

export const createProduct = async (
  datos: Omit<Products, "id">,
): Promise<Products> => {
  const { name, descript, price, available } = datos;
  const result = await pool.query(
    `INSERT INTO product (name, descript, price, available)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, descript, price, available`,
    [name, descript, price, available],
  );
  return result.rows[0];
};

export const updateProduct = async (
  id: number,
  data: Partial<Omit<Products, "id">>,
): Promise<Products | null> => {
  const productoActual = await pool.query(
    "SELECT id, name, descript, price, available FROM product WHERE id = $1",
    [id],
  );

  if (productoActual.rows.length === 0) return null;

  const actual = productoActual.rows[0];

  const name = data.name ?? actual.name;
  const descript = data.descript ?? actual.descript;
  const price = data.price ?? actual.price;
  const available = data.available ?? actual.available;

  const result = await pool.query(
    `UPDATE product 
     SET name = $1, descript = $2, price = $3, available = $4 
     WHERE id = $5 
     RETURNING id, name, descript, price, available`,
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
