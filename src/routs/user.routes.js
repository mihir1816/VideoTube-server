import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()
router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 }, 
        { name: "coverImage", maxCount: 1 }
    ]),
    (req, res, next) => {
        console.log("Files:", req.files); // This will help debug whether files are being received
        console.log("Body:", req.body);
        next();  // Continue to the controller if files are present
    },
    registerUser
);

router.route( "/login" ).post(  loginUser)

router.route( "/logout" ).post( verifyJwt ,  logoutUser)
router.route("/refresh-token" ).post(refreshAccessToken)

export default router