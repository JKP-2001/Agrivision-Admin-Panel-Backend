const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
    username: { type: String, required: true},
    password: { type: String, required: true},
    email: { type: String, required: true},
    role: { type: String, required: true, enums: ['admin', 'mentor', 'superadmin']},
    date: { type: Date, required: true},
    updateDate: { type: Date}
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
