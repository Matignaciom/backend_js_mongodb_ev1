const Paciente = require("../models/paciente");
const validator = require("validator");

// Crear paciente
exports.crearPaciente = async (req, res) => {
  try {
    const { rut, nombre, edad, sexo, enfermedad } = req.body;

    // Validación de datos
    if (!rut || !nombre || !edad || !sexo || !enfermedad) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    // Validación de la edad
    if (!validator.isInt(edad.toString(), { min: 0 })) {
      return res
        .status(400)
        .json({ error: "La edad debe ser un número positivo" });
    }

    // Validación del RUT
    const rutRegex = /^[0-9]{7,8}-[0-9Kk]{1}$/;

    if (!rutRegex.test(rut)) {
      return res.status(400).json({
        error: "El RUT debe tener el formato correcto: 12345678-9 o 12345678-K",
      });
    }

    // Crear paciente
    const paciente = new Paciente(req.body);
    if (req.file) paciente.fotoPersonal = req.file.path;
    await paciente.save();

    res.status(201).json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los pacientes
exports.obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find();
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener paciente por ID
exports.obtenerPacientePorId = async (req, res) => {
  try {
    const paciente = await Paciente.findById(req.params.id);
    if (!paciente)
      return res.status(404).json({ error: "Paciente no encontrado" });

    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar paciente
exports.actualizarPaciente = async (req, res) => {
  try {
    const { rut, nombre, edad, sexo, enfermedad } = req.body;

    // Validación de datos
    if (rut && !/^[0-9]{7,8}-[0-9Kk]{1}$/.test(rut)) {
      return res.status(400).json({
        error: "El RUT debe tener el formato correcto: 12345678-9 o 12345678-K",
      });
    }

    if (edad && !validator.isInt(edad.toString(), { min: 0 })) {
      return res
        .status(400)
        .json({ error: "La edad debe ser un número positivo" });
    }

    const paciente = await Paciente.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!paciente)
      return res.status(404).json({ error: "Paciente no encontrado" });

    res.json(paciente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar paciente
exports.eliminarPaciente = async (req, res) => {
  try {
    const paciente = await Paciente.findByIdAndDelete(req.params.id);
    if (!paciente)
      return res.status(404).json({ error: "Paciente no encontrado" });

    res.json({ message: "Paciente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Búsqueda personalizada
exports.buscarPacientes = async (req, res) => {
  try {
    const { sexo, fechaIngreso, enfermedad } = req.query;

    let query = {};

    if (sexo && !["Masculino", "Femenino", "Otro"].includes(sexo)) {
      return res
        .status(400)
        .json({ error: "Sexo debe ser 'Masculino', 'Femenino' o 'Otro'" });
    }

    if (fechaIngreso && !validator.isDate(fechaIngreso)) {
      return res
        .status(400)
        .json({ error: "La fecha de ingreso debe ser válida" });
    }

    if (enfermedad && !validator.isLength(enfermedad, { min: 3 })) {
      return res
        .status(400)
        .json({ error: "La enfermedad debe tener al menos 3 caracteres" });
    }

    if (sexo) query.sexo = sexo;
    if (fechaIngreso) query.fechaIngreso = fechaIngreso;
    if (enfermedad) query.enfermedad = enfermedad;

    console.log("Consulta que se está ejecutando:", query); // Agrega esto para ver la consulta

    const pacientes = await Paciente.find(query);
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
