import pool from "../config/db.js";

export interface SaleItemInput {
  id_product: number;
  quantity: number;
  unit_price: number;
}

export interface CreateSaleInput {
  id_customer: number;
  items: SaleItemInput[];
}

export const getAllSales = async () => {
  const query = `
    SELECT 
      s.id_sale, 
      s.date, 
      s.total, 
      s.status, 
      s.id_customer, 
      c.name AS customer_name 
    FROM sale s
    INNER JOIN customer c ON s.id_customer = c.id_customer
    ORDER BY s.id_sale DESC
  `;
  const result = await pool.query(query);
  return result.rows;
};

export const getSaleById = async (id: number) => {
  const query = `
    SELECT 
      s.id_sale, 
      s.date, 
      s.total, 
      s.status, 
      s.id_customer, 
      c.name AS customer_name 
    FROM sale s
    INNER JOIN customer c ON s.id_customer = c.id_customer
    WHERE s.id_sale = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const createSaleWithTransaction = async (data: CreateSaleInput) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const total = data.items.reduce(
      (acc, item) => acc + item.quantity * item.unit_price,
      0,
    );

    const saleResult = await client.query(
      `INSERT INTO sale (id_customer, total, status, date) 
       VALUES ($1, $2, $3, NOW()) 
       RETURNING id_sale, id_customer, total, status, date`,
      [data.id_customer, total, "Waiting"],
    );

    const newSale = saleResult.rows[0];

    const itemsInserted = [];
    for (const item of data.items) {
      const subtotal = item.quantity * item.unit_price;

      const detailResult = await client.query(
        `INSERT INTO sale_detail (id_sale, id_product, quantity, unit_price, subtotal) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING id_sale_detail, id_sale, id_product, quantity, unit_price, subtotal`,
        [
          newSale.id_sale,
          item.id_product,
          item.quantity,
          item.unit_price,
          subtotal,
        ],
      );
      itemsInserted.push(detailResult.rows[0]);
    }

    await client.query("COMMIT");

    return {
      ...newSale,
      items: itemsInserted,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};
