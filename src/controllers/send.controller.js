const XLSX = require('xlsx');

// Importando modelos
const Send = require('../models/send');

// Método para cargar envíos masivos
const uploadPackage = async (req, res) => {
    const file = req.body.file;
    const dataFile = readCSV(file);
    const numData = dataFile.length;
    let newSends = [];

    for (let i=0; i<numData; i++) {
        const send = new Send({
            cod_send: dataFile[i].cod_send,
            source_card: dataFile[i].source_card,
            source_name: dataFile[i].source_name,
            source_email: dataFile[i].source_email,
            source_street: dataFile[i].source_street,
            source_city: dataFile[i].source_city,
            source_province: dataFile[i].source_province,
            source_postal_code: dataFile[i].source_postal_code,
            source_country_code: dataFile[i].source_country_code,
            target_card: dataFile[i].target_card,
            target_name: dataFile[i].target_name,
            target_email: dataFile[i].target_email,
            target_street: dataFile[i].target_street,
            target_city: dataFile[i].target_city,
            target_province: dataFile[i].target_province,
            target_postal_code: dataFile[i].target_postal_code,
            target_country_code: dataFile[i].target_country_code,
            length: dataFile[i].length,
            width: dataFile[i].width,
            height: dataFile[i].height,
            dimensions_unit: dataFile[i].dimensions_unit,
            weight: dataFile[i].weight,
            weight_unit: dataFile[i].weight_unit,
            status: writeStatus(3)
        });
        // Guardamos el envío en la BD
        newSends.push(await send.save());
    }

    res.status(200).json({
        newSends,
        numData,
        msg: "Archivos cargados exitosamente."
    });
};

// Método para enviar un paquete
const sendPackage = async (req, res) => {
    const {
        source_card,
        source_name,
        source_email,
        source_street,
        source_city,
        source_province,
        source_postal_code,
        source_country_code,
        target_card,
        target_name,
        target_email,
        target_street,
        target_city,
        target_province,
        target_postal_code,
        target_country_code,
        length,
        width,
        height,
        dimensions_unit,
        weight,
        weight_unit
    } = req.body;

    // Generamos el código de envío
    let cod_send;
    // Buscamos el último envío registrado en la BD
    const finalSend = await Send.find().sort({ createdAt:-1 }).limit(1);
    // Si no existen envíos, se asigna un código de envío inicial
    if (finalSend.length === 0)
        cod_send = "ORD00001";
    // Si existen evíos, se añade un digíto al último código de envío
    else {
        const lat_cod_send = finalSend[0].cod_send;
        const new_cod_send = Number(lat_cod_send.substring(3,8)) + 1;
        cod_send = "ORD" + new_cod_send.toString().padStart(5,0);
    }

    // Asignamos el estado inicial
    let status = writeStatus(0);

    const send = new Send({
        cod_send,
        source_card,
        source_name,
        source_email,
        source_street,
        source_city,
        source_province,
        source_postal_code,
        source_country_code,
        target_card,
        target_name,
        target_email,
        target_street,
        target_city,
        target_province,
        target_postal_code,
        target_country_code,
        length,
        width,
        height,
        dimensions_unit,
        weight,
        weight_unit,
        status
    });
    // Guardamos el envío en la BD
    const sendSaved = await send.save();

    res.status(200).json({
        sendSaved,
        msg: "Envío registrado exitosamente."
    });
};

// Método para consultar el estado del envío por código de envío y/o cédula de cliente
const viewPackageByCod = async (req, res) => {
    let cod = req.params.cod;
    let send;

    // Buscamos el envío por código de envío
    if (cod.length == 8)
        send = await Send.findOne({ cod_send: cod });
    else if (cod.length == 10)
        send = await Send.findOne({ target_card: cod });
    else {
        return res.status(400).json({
            msg: "Código ingresado incorrecto."
        });
    }

    // Si el envío no existe
    if (!send)
        return res.status(400).json({
            msg: "Envío no registrado."
        });
    // Si el envío existe
    const status = send.status;
    res.status(200).json({
        send,
        status,
        msg: "Consulta realizada exitosamente."
    });
};

// Método para marcar los estados de un envío
const statusPackage = async (req, res) => {
    // Verificamos que el estado sea válido
    if (req.body.status < 0 || req.body.status > 4)
        return res.status(400).json({
            msg: "Estado inválido."
        });
    // Guardamos el nuevo estado
    const status = writeStatus(req.body.status);

    // Buscamos el envío por código de envío
    const send = await Send.findOneAndUpdate({ cod_send: req.params.cod }, { status: status }, { new: true });
    
    // Si el envío no existe
    if (!send)
        return res.status(400).json({
            msg: "Envío no registrado."
        });
    // Si el envío existe
    res.status(200).json({
        send,
        msg: "Estado actualizado exitosamente."
    });
};

// Método para consultar todos los envíos asociados a un cliente
const searchPackagesByClient = async (req, res) => {
    // Buscamos los envíos registrados por cédula de cliente
    let sendsSource = await Send.find({ source_card: req.params.card });
    // Buscamos los envíos recibidos por cédula de cliente
    let sendsTarget = await Send.find({ target_card: req.params.card });

    // Si tiene envíos asociados
    res.status(200).json({
        sendsSource,
        sendsTarget,
        msg: "Consultas realizadas exitosamente."
    });
};

// Método auxiliar para extraer los datos de un csv
const readCSV = (url) => {
    const csv = XLSX.readFile(url);
    const sheets = csv.SheetNames;
    const data = XLSX.utils.sheet_to_json(csv.Sheets[sheets[0]]);
    return data;
};

// Método auxiliar para controlar estados
const writeStatus = (id) => {
    const status = [
        {
            msg: "Recibido",
            color: "bg-info"
        },
        {
            msg: "En proceso",
            color: "bg-warning"
        },
        {
            msg: "En camino",
            color: "bg-warning"
        },
        {
            msg: "Cliente ha recibido paquete",
            color: "bg-success"
        },
        {
            msg: "Cancelado",
            color: "bg-danger"
        }
    ];
    return status[id];
};

module.exports = {
    uploadPackage,
    sendPackage,
    viewPackageByCod,
    statusPackage,
    searchPackagesByClient
}