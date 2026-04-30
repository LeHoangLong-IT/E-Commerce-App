// Require Packed
const express = require('express');
// const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();


// MiddleWare
const app = express();
const port = process.env.PORT;

// Test API
app.get('/', (req,res)=>{
    res.send('Backend chạy thành công...')
})
app.listen(port, () => {
     console.log(`Sever đang chạy tại http://localhost:${port} `);
})

// Connect Mongoose
mongoose.connect(`mongodb+srv://lehoanglonggtzt:${process.env.MONGO_DB}@cluster0.fqmbsvz.mongodb.net/?appName=Cluster0`)
.then(() => {
    console.log("OK! MongoDB connected successfully!");
})
.catch((err) => {
    console.log(err);
    
})
