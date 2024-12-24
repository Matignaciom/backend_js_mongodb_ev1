require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const pacienteRoutes = require("./routes/pacienteRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Rutas
app.use("/api/pacientes", pacienteRoutes);

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/iplacex_db_eva1", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conexión exitosa con MongoDB"))
  .catch((err) => {
    console.error("Error al conectar con MongoDB:", err);
    process.exit(1);
  });

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
