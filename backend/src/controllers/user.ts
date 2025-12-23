import User from "../models/User";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { validationResult } from "express-validator";

const JWT_SECRET: string = process.env.JWT_SECRET || "prashant";

interface JwtData {
    user: {
        id: string;
    };
}

export const signup = async (req: Request, res: Response): Promise<Response> => {
    let success = false;

    // Validate incoming request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        const { name, email, password } = req.body;

        // Check existing user
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success,
                error: "This email is already registered.",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Prepare JWT payload
        const data: JwtData = {
            user: {
                id: user._id.toString(),
            },
        };

        // Sign token
        const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: "7d" });

        success = true;
        return res.json({ success, authToken });

    } catch (error) {
        console.error("Signup Error:", (error as Error).message);
        return res.status(500).send("Internal Server Error");
    }
};


export const signin = async (req: Request, res: Response): Promise<Response> => {

    let success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).json({ success, error: "Email or Password is wrong." });
        }
        const { password } = req.body;
        const passwordCompare = await bcrypt.compare(password, user.password);// (string, hash)
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Email or Password is wrong." });
        }

        const data: JwtData = {
            user: {
                id: user._id.toString(),
            },
        };

        // applying json method
        const authtoken = jwt.sign(data, JWT_SECRET);
        success = true;
        return res.json({ success, authtoken });

    } catch (error) {
        console.error("Signin Error:", (error as Error).message);
        return res.status(500).send("Internal Server Error");
    }
};

export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}
export const getUser = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const user = await User.findById(req.user.id).select("-password");
        return res.json(user);

    } catch (error) {
        return res.status(500).send("Internal Server Error");
    }
};

