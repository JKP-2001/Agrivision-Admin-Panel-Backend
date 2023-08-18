const mongoose = require('mongoose');

const Admin = require('../models/Admin');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const saltRounds = 10;

const secret = process.env.JWT_SECRET;

const createNewAdmin = async (req, res) => {

    try{

        const loggedInUser = req.admin;

        const loggedadmin = await Admin.findById(loggedInUser);

        if(loggedadmin.role !== 'superadmin'){
            throw new Error('You are not authorized to create a new admin');
        }

        const { username, password, email, role } = req.body;

        const isadmin = await Admin.findOne({email:email});

        if(isadmin){
            throw new Error('Admin already exists');
        }

        const hashPassword = await bcrypt.hash(password, saltRounds);
        const newAdmin = { username, password:hashPassword, email, role, date: new Date() };

        const admin = new Admin(newAdmin);

        await admin.save();

        res.status(200).json({success:true, message: 'Admin created successfully' });

    }catch(err){
        res.status(400).json({success:false,error:err.toString()});
    }

};



const loginAdmin = async (req, res) => {
    try {

        const { email, password } = req.body;

        const admin = await Admin.findOne({ email: email });

        if (!admin) {
            throw new Error('Admin does not exist');
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            throw new Error('Password does not match');
        }

        const token = jwt.sign({ id: admin._id }, secret, { expiresIn: '1h' });

        res.status(200).json({ success:true, token: token });

    } catch (err) {
        res.status(400).json({success:false, error:err.toString()});
    }
};

const editAdmin = async (req, res) => {
    try {

        const loggedInUser = req.admin;

        const isadmin = await Admin.findById(loggedInUser);

        if(!isadmin){
            throw new Error('Admin does not exist');
        }

        let hashPassword = isadmin.password;

        if(req.body.password){
            hashPassword = await bcrypt.hash(req.body.password, saltRounds);
        }

        await Admin.findByIdAndUpdate(isadmin._id, { username: req.body.username?req.body.username:isadmin.username, password: hashPassword, role: isadmin.role, updateDate: new Date() });

        res.status(200).json({success:true, message: 'Admin updated successfully' });

    } catch (err) {
        res.status(400).json({success:false,error:err.toString()});
    }

};


const getAdminProfile = async (req, res) => {
    try {

        const loggedInUser = req.admin;

        const isadmin = await Admin.findById(loggedInUser).select('-password -__v');

        if(!isadmin){

            throw new Error('Admin does not exist');

        }

        res.status(200).json({success:true, admin: isadmin });

    } catch (err) {
        res.status(400).json({success:false,error:err.toString()});
    }

};

module.exports = { createNewAdmin, loginAdmin, editAdmin, getAdminProfile };






// const createNewAdmin = async (req, res) => {
    //     // console.log({body:req.body})/
    //     const { username, password, email, role } = req.body;
    
    //     const hashPassword = await bcrypt.hash(password, saltRounds);
    //     const newAdmin = { username, password: hashPassword, email, role, date: new Date() };
    
    //     const admin = new Admin(newAdmin);
    
    //     await admin.save();
    // }
    
    