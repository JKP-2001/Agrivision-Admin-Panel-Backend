
const Admin = require('../models/Admin');

const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;


const fetchAdmin = async (req, res, next) => {

    try{

        const token = req.header('auth-token');

        if(!token){
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, secret);

        const admin = await Admin.findById(decoded.id);

        if(!admin){
            throw new Error('Admin does not exist');
        }

        req.admin = admin._id;

        next();

    }catch(err){
        res.status(400).json(err.toString());
    }

};

module.exports = fetchAdmin;

