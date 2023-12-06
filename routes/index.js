const express = require('express');
const router = express.Router();
const { conexion } = require('../database/conexion');

router.get('/', (req, res, next) => {
  res.render('index', { title: 'Página Hospital' });
});

// Función de manejo de errores común
const handleQuery = (error, resultado, res) => {
  if (error) {
    console.error('Ocurrió un error en la ejecución:', error);
    res.status(500).send('Error en la ejecución');
  } else {
    res.status(200).render(res.locals.template, { resultado });
  }
};

router.get('/listado-medicos', (req, res) => {
  conexion.query('SELECT * FROM medicos;', (error, resultado) => handleQuery(error, resultado, res));
});

router.get('/listado-pacientes', (req, res) => {
  conexion.query('SELECT * FROM pacientes;', (error, resultado) => handleQuery(error, resultado, res));
});

router.get('/listado-citas', (req, res) => {
  const query = `
    SELECT fecha_cita, pacientes.nombres, pacientes.apellidos, pacientes.telefono,
    medicos.especialidad, medicos.consultorio, medicos.nombres nombresMedico, medicos.apellidos apellidosMedico
    FROM cita_medica, pacientes, medicos
    WHERE cedula_medico=medicos.cedula AND cedula_paciente=pacientes.cedula;
  `;
  conexion.query(query, (error, resultado) => handleQuery(error, resultado, res));
});

router.post('/agregar-medico', (req, res) => {
  const { nombres, apellidos, cedula, consultorio, telefono, correo, especialidad } = req.body;
  const query = `
    INSERT INTO medicos (cedula, nombres, apellidos, especialidad, consultorio, correo, telefono)
    VALUES (${cedula}, '${nombres}', '${apellidos}', '${especialidad}', '${consultorio}', '${correo}', '${telefono}')
  `;
  conexion.query(query, (error, resultado) => handleQuery(error, resultado, res));
});

router.post('/agregar-paciente', (req, res) => {
  const { nombres, apellidos, cedula, fecha_nacimiento, telefono } = req.body;
  const query = `
    INSERT INTO pacientes (cedula, nombres, apellidos, fecha_nacimiento, telefono)
    VALUES (${cedula}, '${nombres}', '${apellidos}', '${fecha_nacimiento}', '${telefono}')
  `;
  conexion.query(query, (error, resultado) => handleQuery(error, resultado, res));
});

router.post('/consulta-cita', (req, res) => {
  const especialidad = req.body.especialidad;
  const query = `SELECT * FROM medicos WHERE especialidad='${especialidad}';`;
  conexion.query(query, (error, resultado) => handleQuery(error, resultado, res));
});

router.post('/agregar-cita', (req, res) => {
  const { cedula_paciente, fecha_cita, medico } = req.body;
  const query = `INSERT INTO cita_medica (cedula_medico, cedula_paciente, fecha_cita)
                 VALUES (${medico}, ${cedula_paciente}, '${fecha_cita}')`;
  conexion.query(query, (error, resultado) => handleQuery(error, resultado, res));
});

module.exports = router;
