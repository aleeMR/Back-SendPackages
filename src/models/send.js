const mongoose = require('mongoose');

const { Schema } = mongoose;

const SendSchema = new Schema({
    cod_send: { 
        type: String, 
        unique: true,
        required: true
    },
    source_card: {
        type: String, 
        required: true
    },
    source_name: {
        type: String, 
        required: true
    },
    source_email: {
        type: String,
        required: true
    },
    source_street: {
        type: String,
        required: true
    },
    source_city: {
        type: String,
        required: true
    },
    source_province: {
        type: String,
        required: true
    },
    source_postal_code: {
        type: String,
        required: true
    },
    source_country_code: {
        type: String,
        required: true
    },
    target_card: {
        type: String, 
        required: true
    },
    target_name: {
        type: String, 
        required: true
    },
    target_email: {
        type: String,
        required: true
    },
    target_street: {
        type: String,
        required: true
    },
    target_city: {
        type: String,
        required: true
    },
    target_province: {
        type: String,
        required: true
    },
    target_postal_code: {
        type: String,
        required: true
    },
    target_country_code: {
        type: String,
        required: true
    },
    length: { 
        type: Number, 
        required: true 
    },
    width: {
        type: Number, 
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    dimensions_unit: {
        type: String,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    weight_unit: {
        type: String,
        required: true
    },
    status: {
        type: Object
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Send', SendSchema);