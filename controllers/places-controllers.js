const {validationResult} = require('express-validator');
const HttpError = require('../models/http-error')
const Place = require('../models/place');
const User = require('../models/user');
const mongoose = require('mongoose');
const { response } = require('express');

// User Get single place by id.
const getPlaceById = async (req, res) => {
    const placeId = req.params.pid
    try {
        const place = await Place.findById(placeId)
        res.json({place})
    } catch (error) {
        res.status(500).send('Somthing went wrong, could not find a place')
    }
}

//User Get place by user id - like : api/places/user/64c21acf1f9e5d8700a57c0c
const getPlacesByUserId = async (req,res,next) => {
    const userId = req.params.uid;
    // console.log(userId);
    try {
        const userWithPlaces = await User.findById(userId).populate('places');
        // console.log("user with place", userWithPlaces);
        if(!userWithPlaces || userWithPlaces.places.length === 0){
            res.status(404).send('could not find a place for the provided user id.'); 
            // return next(
            //     new HttpError('Could not find a places for the provided user id.',404)
            // );
        }else{
            res.status(200).send({places:userWithPlaces.places})   
        }
    } catch (error) {
        res.status(500).send('fetching places failed, please try again later')
    }

}

// User New Create Place
const createPlace = async (req,res,next) => {
    const {title, description, location ,address, creator} = req.body;
    let createdPlace = new Place({
        title,
        description,
        image:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Empire_State_Building_%28aerial_view%29.jpg/800px-Empire_State_Building_%28aerial_view%29.jpg?20170925150222',
        location,
        address,
        creator,
    });

    try {
        const error = validationResult(req);
        if(!error.isEmpty()) {
            res.status(422).send('Invalid inputs passed, please check your data.')
        }else{
            try {
                const user = await User.findById(creator)
                if(!user){
                    res.status(404).send('Could not find user for provided id.')
                }else{
                    const sess = await mongoose.startSession();
                    sess.startTransaction();
                    await createdPlace.save(sess);
            
                    user.places.push(createdPlace)
                    await user.save(sess);
            
                    await sess.commitTransaction();
                    res.status(201).send(createdPlace)
                }
            } catch (error) {
                res.status(500).send('Creating Place Failed, Please try again!');
            }    
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Creating place failed,please try again.');
        
    }
}

const updatePlace = async (req,res) => {
    const {title, description} = req.body;
    const placeId = req.params.pid;
    
    try {
        const place = await Place.findById(placeId);
        place.title = title;
        place.description = description;
        const error = validationResult(req);
        if(!error.isEmpty()) {
            res.status(422).send('Invalid inputs passed, please check your data.')
        }else{
            await place.save();
            res.status(200).send(place);
        }
    } catch (error) {
        res.status(500).send('Something went wrong, could not update place.')
    }
}

const deletePlace = async (req, res) => {
    try {
        const placeId = req.params.pid;
        const sess = await mongoose.startSession();
        sess.startTransaction();
        const deleteUserPlace = await Place.findByIdAndDelete(placeId).populate('creator')
        deleteUserPlace.creator.places.pull(deleteUserPlace)
        await deleteUserPlace.creator.save(sess)
        await sess.commitTransaction()
        if(!deleteUserPlace){
            res.status(404).send("Could not find place for this id.")
        }
        res.send('Delete Successfully')
    } catch (error) {
        res.send(error)
    }
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;