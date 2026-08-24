import express, { type Request, type Response } from "express";
import swaggerRouter from "./routes/swagger.router.js";
import cors from "cors";
import pool from "./config/db.js";

const port = process.env.PORT;

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

app.use("/api/docs", swaggerRouter);

app.get("/", (req: Request, res: Response) => {
  /*#swagger.tags = ['Tests']*/
  res.json({
    status: "Server online",
    version: "1.0.0",
  });
});

app.get("/api/menu", async (req: Request, res: Response) => {
  /* 
    #swagger.tags = ['Menú']
    #swagger.summary = 'Obtener todos los productos del menú'
    #swagger.description = 'Consulta la tabla product en PostgreSQL y devuelve la lista completa'
    #swagger.responses[200] = { 
      description: 'Lista de productos obtenida exitosamente' 
    }
    #swagger.responses[500] = { 
      description: 'Error interno de la base de datos' 
    }
  */
  try {
    const resultado = await pool.query("SELECT * FROM product");
    return res.status(200).json(resultado.rows);
  } catch (error) {
    console.error("Erro al leer la base de datos: ", error);
    return res.status(500).json({ error: "error en la consulta al menu" });
  }
});

app.listen(port, () => {
  console.log(`URL: http://localhost:${port}`);
});
