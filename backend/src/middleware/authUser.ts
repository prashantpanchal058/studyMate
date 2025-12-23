import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || "prashant";

export interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

const fetchUser = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.header("auth-token");

    if (!token) {
        return res.status(401).json({ error: "Please authenticate using a valid token." });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET) as JwtPayload & {
            user: { id: string };
        };

        req.user = data.user;
        next();

    } catch (error) {
        return res.status(401).json({ error: "Please authenticate using a valid token." });
    }
};

export default fetchUser;
