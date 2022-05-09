// Environment Variables (Variables de entorno)
require('dotenv').config();

const app = require('./src/server');
const { mongoose } = require('./src/config/database');

// Starting the server (Iniciando el servidor)
// ---------------------------------------------------------------
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
