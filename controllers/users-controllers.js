const uuid = require('uuid');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user');

const getUsers = async (req,res) => {
    let users;
    try {
        users = await User.find({},'-password')
        res.status(200).send(users)
    } catch (error) {
        res.status(404).send('Fetching users failed, please try again later.')
    }
};

// User signup 
const signup = async (req,res,next) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return next(
            res.status(422).send('Invalid inputs passed, please check your data.')
        );
    }
    const {name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({email})
        if(existingUser) {
            res.status(422).send("User exists already,please login instead.")
        }    
        const createdUser = new User({
            name,
            email,
            image:'https://img.icons8.com/arcade/64/gender-neutral-user--v2.png',
            password,
            places: []
        })
        try {
            const saveUser = await createdUser.save()
            res.status(201).send(saveUser)
        } catch (e) {
            res.status(500).send('Signin up failed, please try again.')
        }
    } catch (err) {
        res.status(500).send('Signin up failed, please try again.')
    }
};

// User Login 
const login = async (req,res) => {
    const {email, password} = req.body;

    try {
        const existingUser = await User.findOne({email: email})
        if(!existingUser || existingUser.password !== password) {
            res.status(401).send("Invalid credential, could not log you in.")
        }else{
            const responseData = {
                message:"Logged in successfully",
                _id:existingUser._id
            }
            res.send(responseData)
        }
    } catch (err) {
        res.status(500).send('Logging in failed, please try again.')
    }
  
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;

