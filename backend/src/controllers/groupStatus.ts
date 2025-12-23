import GroupStatus from "../models/GroupStatus";
import Group from "../models/Group";
import { Request, Response } from "express";

interface AuthRequest extends Request {
    user?: { id: string };
}

export const createGroupStatus = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const status = "request";
        const userId = req.user?.id;
        const groupId = req.params.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group does not exist" });
        }

        const alreadyExists = await GroupStatus.findOne({ userId, groupId });
        if (alreadyExists) {
            return res.status(400).json({
                error: "Status already submitted by this user for this group",
            });
        }

        const groupMateId = group.userId;

        const groupStatus = new GroupStatus({
            userId,
            groupMateId,
            groupId,
            status,
        });

        await groupStatus.save();

        return res.status(201).json({
            msg: "Group status added successfully",
            groupStatus,
        });

    } catch (error) {
        console.error("send request Group Error:", (error as Error).message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const delGroupStatus = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.id;
        const groupStatusId = req.params.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        const groupStatus = await GroupStatus.findById(groupStatusId);
        if (!groupStatus) {
            return res.status(404).json({ error: "Group status not found" });
        }

        const ownerId = String(groupStatus.userId);
        const groupMateId = String(groupStatus.groupMateId);

        const isAllowed = userId === ownerId || userId === groupMateId;

        if (!isAllowed) {
            return res.status(403).json({
                error: "You do not have permission to delete this group status",
            });
        }

        await GroupStatus.findByIdAndDelete(groupStatusId);

        return res.status(200).json({
            msg: "Group status deleted successfully",
        });

    } catch (error) {
        console.error("delete Group Error:", (error as Error).message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const updateGroupStatus = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.id;
        const groupStatusId = req.params.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        const groupStatus = await GroupStatus.findById(groupStatusId);
        if (!groupStatus) {
            return res.status(404).json({ error: "Group status not found" });
        }

        const groupOwnerId = String(groupStatus.groupMateId);

        if (userId !== groupOwnerId) {
            return res.status(403).json({
                error: "Only the group owner can update this status",
            });
        }

        if (groupStatus.status !== "request") {
            return res.status(400).json({
                error: "Status can only be updated from 'pending' to 'complete'",
            });
        }

        groupStatus.status = "complete";
        await groupStatus.save();

        return res.status(200).json({
            msg: "Group status updated successfully",
            groupStatus,
        });

    } catch (error) {
        console.error("update Group Status Error:", (error as Error).message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAdminGroupStatus = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        const groupStatus = await GroupStatus.find({
            status:"complete",
            $or: [
                { userId: userId },
                { groupMateId: userId }
            ]
        }).populate("userId").populate("groupMateId").populate("groupId");

        return res.status(200).json(groupStatus);

    } catch (error) {
        console.error("getAdminGroupStatus Error:", (error as Error).message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getrequestedGroupStatus = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }

        const groupStatus = await GroupStatus.find({
            status:"request",
            groupMateId: userId
        }).populate("userId").populate("groupMateId").populate("groupId");

        return res.status(200).json(groupStatus);

    } catch (error) {
        console.error("getAdminGroupStatus Error:", (error as Error).message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getFindGroupStatus = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        // const userId = req.user?.id;
        const groupId = req.params.id;

        // if (!userId) {
        //     return res.status(401).json({ error: "Unauthorized: User not found" });
        // }

        const groupStatus = await GroupStatus.findOne({groupId:groupId});

        if (!groupStatus) {
            return res.status(408).json("no group created till now. ");
        }

        return res.send(groupStatus);

    } catch (error) {
        console.error("get Group Status Error:", (error as Error).message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

export const getFindStatus = async (req: AuthRequest, res: Response): Promise<Response> => {
    try {
        const groupStatusId = req.params.id;

        const groupStatus = await GroupStatus.findById(groupStatusId);

        if (!groupStatus) {
            return res.status(408).json("no group created till now. ");
        }

        return res.send(groupStatus);

    } catch (error) {
        console.error("get Group Status Error:", (error as Error).message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}