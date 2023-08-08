const express = require('express');
require('./db/connection');
const cors = require('cors');
const bodyParser = require('body-parser');
const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/users-routes');

const app = express();
const port = 5000
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE ');
    next();
})

app.use("/api/users",usersRoutes)
app.use("/api/places",placesRoutes)

app.use((error,req,res,next) => {
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || "An unknown error occurred"})
})

app.listen(port,() =>{
    console.log(`connection is set up ${port}`);
})