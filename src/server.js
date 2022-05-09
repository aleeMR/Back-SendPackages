const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const { mongoose } = require('./config/database');

const app = express();

// Settings (Configuraciones)
// ---------------------------------------------------------------
app.set('port', process.env.PORT || 4000);

// Middlewares (Programas intermedios)
// ---------------------------------------------------------------
app.use(cors());
// Para ver las peticiones al servidor con un formateado de texto
app.use(morgan('dev'));
// Para verificar si los datos provienen en formato json
app.use(express.json());

// Routes (Rutas)
// ---------------------------------------------------------------
app.use('/api/package', require('./routes/send.routes'));

// Static files (Archivos estáticos)
// ---------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;