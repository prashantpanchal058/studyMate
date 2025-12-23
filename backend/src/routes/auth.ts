import express from "express";
import User from "../models/User";
import fetchUser from "../middleware/authUser";
import { signup, signin, getUser } from "../controllers/user";
import { body } from "express-validator";

const router = express.Router();

router.post(
    "/signup",
    [
        body("name", "Name must be at least 6 characters").isLength({ min: 6 }),
        body("email", "Enter a valid email").isEmail(),
        body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    ],
    signup
);

router.post("/signin",[
    body("email", "Enter a valid email").isEmail(),
        body("password", "Password must be at least 6 characters").isLength({ min: 6 }),
], signin)

router.get('/getuser', fetchUser, getUser);


export default router;
