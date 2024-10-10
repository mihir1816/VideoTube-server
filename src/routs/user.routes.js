import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js'
import {addVideoToWatchHistory , getWatchHistory , getUserChannelProfile , updateUserCoverImage , updateUserAvatar , loginUser, logoutUser, refreshAccessToken, registerUser , changeCurrentPassword , updateAccountDetails,getCurrentUser  } from "../controllers/user.controller.js";
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

router.route( "/login" ).post(loginUser)

router.route( "/logout" ).post( verifyJwt ,  logoutUser)

router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJwt, changeCurrentPassword)
router.route("/current-user").get(verifyJwt, getCurrentUser)
router.route("/update-account").patch(verifyJwt, updateAccountDetails)

router.route("/avatar").patch(verifyJwt, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJwt, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJwt, getUserChannelProfile)
router.route("/history").get(verifyJwt, getWatchHistory)
router.route("/addVideoToWatchHistory").post(verifyJwt, addVideoToWatchHistory)

export default router

