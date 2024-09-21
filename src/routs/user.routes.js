import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post((req, res) => {
    console.log("Register route hit")
    registerUser(req, res);
});


export default router