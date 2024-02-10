import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./Routes/auth.js";
import userRouter from "./Routes/user.js";
import doctorRouter from "./Routes/doctor.js";
dotenv.config()

const app = express()
const port = process.env.PORT || 8000

const corsOptions = {
    origin:true
}

app.get('/',(req,res)=>{
    res.send("Api is working")
})

//database connection
mongoose.set("strictQuery",false)
const connectDB = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser:true,
            useUnifiedTopology: true,
        })
        console.log("MongoDb database is connected");
    } catch (error) {
        console.log("MongoDb database is connection failed");
    }
}

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',userRouter)
app.use('/api/v1/doctors',doctorRouter)

app.listen(port,()=>{
    connectDB();
    console.log("Server is running on port "+port);
})
