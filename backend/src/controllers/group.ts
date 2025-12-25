import User from "../models/User";
import Group from "../models/Group";
import { Request, Response } from "express";
import { validationResult } from "express-validator";

interface AuthRequest extends Request {
    user?: { id: string };
}

export const createGroup = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { topic, subtopic, desc, time, days } = req.body;

        if (!topic || !subtopic || !desc || !time || !days) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        const alreadyGroup = await Group.findOne({ topic, subtopic, desc, time, days });

        if (alreadyGroup) {
            return res.status(409).json({
                error: "This group already exists",
            });
        }

        // Create group
        const group = new Group({
            topic,
            subtopic,
            desc,
            time,
            days,
            userId,
        });

        await group.save();

        return res.status(201).json({ msg: "Group created successfully", group });

    } catch (error) {
        console.error("Create Group Error:", (error as Error).message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getGroup = async (req: Request, res: Response): Promise<Response> => {

    try {
        const groupid = await Group.findById(req.params.id)

        if (!groupid) {
            return res.status(404).json("error in getting group info.");
        }

        return res.send(groupid);

    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

export const getGroups = async (req: Request, res: Response): Promise<Response> => {

    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const groups = await Group.find({ userId: userId }).sort({ createdAt: -1 });

        if (!groups) {
            return res.status(404).json("error in getting groups.");
        }

        return res.send(groups);

    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

export const deleteGroup = async (req: Request, res: Response): Promise<Response> => {

    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        await group.deleteOne();

        return res.json({ message: "group deleted successfully" });

    } catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
}

export const getAllGroup = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.id;

        let query = {};

        if (userId) {
            query = { userId: { $ne: userId } };
        }

        const groups = await Group.find(query).sort({ createdAt: -1 });

        if(!groups){
            return res.send(404).json("error")
        }

        if(groups.length === 0) {
            return res.json([]);
        }
        return res.json(groups);

    } catch (error) {
        console.error("Error in getAllGroup:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
};