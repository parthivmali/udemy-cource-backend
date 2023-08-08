const uuid = require('uuid');
const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
const signup = async (req,res) => {
    const error = validationResult(req);
    if(!error.isEmpty()) {
        return res.status(422).send('Invalid inputs passed, please check your data.')
    }
    const {name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({email})
        if(existingUser) {
            res.status(422).send("User exists already,please login instead.")
        }    
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 12)
            
        } catch (error) {
            res.status(500).send('Could not create user, please try again')
        }
        const createdUser = new User({
            name,
            email,
            image:'https://img.icons8.com/arcade/64/gender-neutral-user--v2.png',
            password : hashedPassword,
            places: []
        })
        let token;
        try {
            token = jwt.sign(
                { userId: createdUser.id, email: createdUser.email },
                'supersecret_dont_share',
                { expiresIn: '1h' }
            );
        } catch (error) {
            return res.status(500).send('Signup failed, please try again!');
        }

        try {
            // Save the user only if it does not already exist
            await createdUser.save();
            res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token });
        } catch (e) {
            res.status(500).send('Signup failed, please try again!');
        }
    } catch (err) {
        res.status(500).send('Signin up failed, please try again.')
    }
};

// User Login 
const login = async (req,res) => {
    const {email, password} = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({email})
        if (!existingUser) {
            return res.status(401).send("Invalid credential, could not log you in.");
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.password);
        if (!isValidPassword) {
            return res.status(401).send("Invalid credential, could not log you in.");
        }

        const token = jwt.sign(
            { userId: existingUser.id, email: existingUser.email },
            'supersecret_dont_share',
            { expiresIn: '1h' }
        );

        const responseData = {
            userId: existingUser.id,
            email: existingUser.email,
            token: token,
        };

        res.status(200).json(responseData);
        // if(!existingUser || existingUser.password !== password) {
        //     res.status(401).send("Invalid credential, could not log you in.")
        // }else{
        //     const responseData = {
        //         // message:"Logged in successfully",
        //         // _id:existingUser._id
        //         userId: existingUser.id,
        //         email: existingUser.email,
        //         token: token,
        //     }
        //     res.send(responseData)
        // }
    } catch (err) {
        res.status(500).send('Logging in failed, please try again.')
    }
  
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;

