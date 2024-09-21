import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import { loginUser, logoutUser, registerUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
   
    upload.fields([
        {
            name : "avatar" , 
            maxCount : 1 
        } , 
        {
            name : "coverImage" , 
            maxCount : 1 
        }
    ]) ,
    registerUser
    // console.log("Register route hit")
);

router.route( "/login" ).post(  loginUser)

router.route( "/logout" ).post( verifyJwt ,  logoutUser)

export default router