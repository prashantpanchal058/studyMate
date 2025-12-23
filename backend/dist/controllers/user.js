"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.signin = exports.signup = void 0;
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const JWT_SECRET = process.env.JWT_SECRET || "prashant";
const signup = async (req, res) => {
    let success = false;
    // Validate incoming request
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        const { name, email, password } = req.body;
        // Check existing user
        let user = await User_1.default.findOne({ email });
        if (user) {
            return res.status(400).json({
                success,
                error: "This email is already registered.",
            });
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // Create new user
        user = await User_1.default.create({
            name,
            email,
            password: hashedPassword,
        });
        // Prepare JWT payload
        const data = {
            user: {
                id: user._id.toString(),
            },
        };
        // Sign token
        const authToken = jsonwebtoken_1.default.sign(data, JWT_SECRET, { expiresIn: "7d" });
        success = true;
        return res.json({ success, authToken });
    }
    catch (error) {
        console.error("Signup Error:", error.message);
        return res.status(500).send("Internal Server Error");
    }
};
exports.signup = signup;
const signin = async (req, res) => {
    let success = false;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        let user = await User_1.default.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ success, error: "Email or Password is wrong." });
        }
        const { password } = req.body;
        const passwordCompare = await bcryptjs_1.default.compare(password, user.password); // (string, hash)
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Email or Password is wrong." });
        }
        const data = {
            user: {
                id: user._id.toString(),
            },
        };
        // applying json method
        const authtoken = jsonwebtoken_1.default.sign(data, JWT_SECRET);
        success = true;
        return res.json({ success, authtoken });
    }
    catch (error) {
        console.error("Signin Error:", error.message);
        return res.status(500).send("Internal Server Error");
    }
};
exports.signin = signin;
const getUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await User_1.default.findById(req.user.id).select("-password");
        return res.json(user);
    }
    catch (error) {
        return res.status(500).send("Internal Server Error");
    }
};
exports.getUser = getUser;
