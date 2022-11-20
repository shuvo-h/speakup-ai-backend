// external imports 
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
// build express app 
const app = express();
const port = process.env.PORT || 5000;

// app middlewares 
dotenv.config();
const { envInfo } = require("./src/utils/envInitializer");

const corsOptions = {
    // origin: [process.env.FRONTEND_BASE_URL, process.env.FRONTEND_DEV_URL,],
    origin: [envInfo.FRONTEND_BASE_URL, envInfo.FRONTEND_DEV_URL,],
    credentials: true,
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))


// internal imports 
const { notFoundHandler, errorHandler } = require("./src/middleware/common/errorHandler");
const { authRouter } = require("./src/router/authenticationRouter");
const { audioConvertRouter } = require("./src/router/audioConvertRoute");
const { convert_cardRouter } = require("./src/router/convert_cardRoute");
const { freeRoute } = require("./src/router/freeRoutes");
const { packageRoutes } = require("./src/router/packageRouter");
const { paymentRoutes } = require("./src/router/paymentRoutes");


// database connection 
mongoose.connect(envInfo.MONGO_CONNECTION_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'SpeakUp-AI'
}).then(()=>console.log("DB connection successfull."))
.catch(err => console.log(err))

// routing setup 
// Authentication registration login router 
app.use("/api/v1/auth",authRouter)

// audio convert  router
app.use("/api/v1/audio",audioConvertRouter)

// convert card router
app.use("/api/v1/convert_card",convert_cardRouter)

// free ip offer router
app.use("/api/v1/free",freeRoute)

// package router
app.use("/api/v1/package",packageRoutes)

// payment router
app.use("/api/v1/payment",paymentRoutes)


// public test route 
app.get("/", (req,res)=>{
    res.send("Word counter wordpress  server running...")
    
})

/*
// scheduler in childprocess Tasks
// continyously awake a heroku app 
import https from "https";
import { callSchedulerToRunPost } from "./src/utilities/childProcessPoster.mjs";
callSchedulerToRunPost();
setInterval(()=>{
    const data = []
    try {
        const gRes = https.get(`${process.env.OWN_BASE_URI_KEEP_HEROKU_AWAKE}`,res=>{
             res.on("data",chunk=>{
                 data.push(chunk);
             });
             res.on("end",()=>{
                 // const resData = JSON.parse(Buffer.concat(data).toString());
                 const resData = Buffer.concat(data).toString();
                 const d = new Date()
                 console.log( d.toISOString().split("T")[0]," ",d.toISOString().split("T")[1].slice(0,-5)," : ","awake => ",resData);
             })
        }).on("error",err=>{
         console.log(err);
        });
    } catch (error) {
        console.log(error);
    }
}, 10 * 60 * 1000)
*/


// 404 not found handler
app.use(notFoundHandler);

// common error handler
app.use(errorHandler)

app.listen(port,()=>{
    console.log("Speakup AI server running at ",port);
})
