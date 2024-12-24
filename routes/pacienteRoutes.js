const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const pacienteController = require("../controllers/pacienteController");

const router = express.Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${uuidv4()}-${file.originalname}`),
});
const upload = multer({ storage });

// Rutas
router.post(
  "/",
  upload.single("fotoPersonal"),
  pacienteController.crearPaciente
);
router.get("/", pacienteController.obtenerPacientes);
router.get("/:id", pacienteController.obtenerPacientePorId);
router.put("/:id", pacienteController.actualizarPaciente);
router.delete("/:id", pacienteController.eliminarPaciente);

// Nueva ruta para búsqueda personalizada
router.get("/buscar", pacienteController.buscarPacientes);

module.exports = router;
