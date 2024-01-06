const express = require('express');
const cors=require('cors');
const axios=require('axios');
const mongoose=require('mongoose');
const color = require("colors");
const connectDB=require('./config/db')
const bodyParser=require('body-parser');
const userRoutes=require('./Routes/userRoutes');
require('dotenv').config();

connectDB();



const app=express();
let port=process.env.PORT;
const mongourl=process.env.DB_URL;
app.use(cors());
app.use(bodyParser.json());
app.use(express.json())




app.use('/api/users', userRoutes);



app.listen(port,()=>{
    console.log(`SERVING ON http://localhost:${port}`);
})