'use strict';
// Genera solo el dossier de Luismi con ruta de salida correcta
const fs = require('fs');

// Leer el script original y ejecutarlo cambiando la ruta de salida
let src = fs.readFileSync('./generate_comercial_docx.js', 'utf-8');

// Cambiar la ruta de salida
src = src.replace(
  'C:\\\\Users\\\\jose2\\\\OneDrive\\\\Escritorio\\\\proyecto.comandalia\\\\',
  'C:\\\\Users\\\\jose2\\\\OneDrive\\\\Escritorio\\\\mcp\\\\'
);

// Solo generar el de Luismi
src = src.replace(
  `const agents = [
  { name: 'Jose Antonio Sanchez Guerra', id: 'AGT-001' },
  { name: 'Alejandro Villaverde del Tesoro', id: 'AGT-002' },
  { name: 'Luis Miguel Sobrino Aguirre', id: 'AGT-003', firstName: 'Luis Miguel' },
];`,
  `const agents = [
  { name: 'Luis Miguel Sobrino Aguirre', id: 'AGT-003', firstName: 'Luis Miguel' },
];`
);

// Escribir script temporal y ejecutarlo
fs.writeFileSync('./gen_luismi_tmp.js', src, 'utf-8');
require('./gen_luismi_tmp.js');
