const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
   title: {
    type:String,
    require:true
   },
   description: {
    type:String,
    require:true
   },
   image: {
    type:String,
    require:true
   },
   address: {
    type:String,
    require:true
   },
   location: {
    lat:{
        type:Number,
        require:true
    },
    lng:{
        type:Number,
        require:true
    }
   },
   creator: {
    type: mongoose.Types.ObjectId,
    require:true,
    ref: 'User'
   }
});

const Place = new mongoose.model('Place',placeSchema);
module.exports = Place;