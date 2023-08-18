require('dotenv').config();

const adminRoutes = require('express').Router();

const fetchAdmin = require('../middlewares/fetchAdmin');

const { createNewAdmin, loginAdmin, editAdmin, getAdminProfile } = require('../controllers/AdminControllers.js');

adminRoutes.post('/create', fetchAdmin, createNewAdmin);

adminRoutes.post('/login', loginAdmin);

adminRoutes.patch('/update', fetchAdmin, editAdmin);

adminRoutes.get("/getadmin",fetchAdmin,getAdminProfile)

module.exports = adminRoutes;

