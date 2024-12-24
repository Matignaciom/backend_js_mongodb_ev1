const mongoose = require("mongoose");

const pacienteSchema = new mongoose.Schema({
  rut: { type: String, required: true },
  nombre: { type: String, required: true },
  edad: { type: Number, required: true },
  sexo: { type: String, required: true },
  fotoPersonal: { type: String, default: "" },
  fechaIngreso: { type: Date, default: Date.now },
  enfermedad: { type: String, required: true },
  revisado: { type: Boolean, default: false },
});

module.exports = mongoose.model("Paciente", pacienteSchema);
