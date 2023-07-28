const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/udemy-course-api",{
    useUnifiedTopology: true, 
    useNewUrlParser: true
}).then(()=>{
    console.log("Connection successful");
}).catch((err)=>{
    console.log("No connection");
})