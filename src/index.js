import dotenv from "dotenv" ; 

import mongoose from "mongoose";
import connectDB from "./db/index.js";

dotenv.config({
    path : "./env"
})

connectDB()
.then( () => {
    app.listen( process.env.PORT || 8000 , () => {
        console.log(` server is running on : ${process.env.PORT}`) ; 
    }  )
}
).catch( (err) => {
    console.log(`mongoDB database is not connected : ` , err ) ; 
} ) ; 
