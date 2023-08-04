const mongoose = require('mongoose');
mongoose.connect("mongodb://127.0.0.1:27017/udemy-course-api",{
    useUnifiedTopology: true, 
    useNewUrlParser: true
}).then(()=>{
    console.log("Connection successful");
}).catch((err)=>{
    console.error("Connection error:", err.message);
})