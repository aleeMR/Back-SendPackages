const express = require('express');
const router = express.Router();

// Importando controladores
const SendCtrl = require('../controllers/send.controller');

// 1. Ruta para cargar envíos masivos
router.post('/upload', SendCtrl.uploadPackage);

// 2. Ruta para enviar un paquete
router.post('/send', SendCtrl.sendPackage);

// 3. Ruta para consultar el estado del envío por código de envío y/o cédula de cliente
router.get('/view/:cod', SendCtrl.viewPackageByCod);

// 4. Ruta para marcar los estados de un envío
router.post('/view/:cod', SendCtrl.statusPackage);

// 5. Ruta para consultar todos los envíos asociados a un cliente
router.get('/search/:card', SendCtrl.searchPackagesByClient);

module.exports = router;