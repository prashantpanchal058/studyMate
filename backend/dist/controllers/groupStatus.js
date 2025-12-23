"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFindStatus = exports.getFindGroupStatus = exports.getrequestedGroupStatus = exports.getAdminGroupStatus = exports.updateGroupStatus = exports.delGroupStatus = exports.createGroupStatus = void 0;
const GroupStatus_1 = __importDefault(require("../models/GroupStatus"));
const Group_1 = __importDefault(require("../models/Group"));
const createGroupStatus = async (req, res) => {
    try {
        const status = "request";
        const userId = req.user?.id;
        const groupId = req.params.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }
        const group = await Group_1.default.findById(groupId);
        if (!group) {
            return res.status(404).json({ error: "Group does not exist" });
        }
        const alreadyExists = await GroupStatus_1.default.findOne({ userId, groupId });
        if (alreadyExists) {
            return res.status(400).json({
                error: "Status already submitted by this user for this group",
            });
        }
        const groupMateId = group.userId;
        const groupStatus = new GroupStatus_1.default({
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
    }
    catch (error) {
        console.error("send request Group Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.createGroupStatus = createGroupStatus;
const delGroupStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        const groupStatusId = req.params.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }
        const groupStatus = await GroupStatus_1.default.findById(groupStatusId);
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
        await GroupStatus_1.default.findByIdAndDelete(groupStatusId);
        return res.status(200).json({
            msg: "Group status deleted successfully",
        });
    }
    catch (error) {
        console.error("delete Group Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.delGroupStatus = delGroupStatus;
const updateGroupStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        const groupStatusId = req.params.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }
        const groupStatus = await GroupStatus_1.default.findById(groupStatusId);
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
    }
    catch (error) {
        console.error("update Group Status Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.updateGroupStatus = updateGroupStatus;
const getAdminGroupStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }
        const groupStatus = await GroupStatus_1.default.find({
            status: "complete",
            $or: [
                { userId: userId },
                { groupMateId: userId }
            ]
        }).populate("userId").populate("groupMateId").populate("groupId");
        return res.status(200).json(groupStatus);
    }
    catch (error) {
        console.error("getAdminGroupStatus Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getAdminGroupStatus = getAdminGroupStatus;
const getrequestedGroupStatus = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }
        const groupStatus = await GroupStatus_1.default.find({
            status: "request",
            groupMateId: userId
        }).populate("userId").populate("groupMateId").populate("groupId");
        return res.status(200).json(groupStatus);
    }
    catch (error) {
        console.error("getAdminGroupStatus Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getrequestedGroupStatus = getrequestedGroupStatus;
const getFindGroupStatus = async (req, res) => {
    try {
        // const userId = req.user?.id;
        const groupId = req.params.id;
        // if (!userId) {
        //     return res.status(401).json({ error: "Unauthorized: User not found" });
        // }
        const groupStatus = await GroupStatus_1.default.findOne({ groupId: groupId });
        if (!groupStatus) {
            return res.status(408).json("no group created till now. ");
        }
        return res.send(groupStatus);
    }
    catch (error) {
        console.error("get Group Status Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getFindGroupStatus = getFindGroupStatus;
const getFindStatus = async (req, res) => {
    try {
        const groupStatusId = req.params.id;
        const groupStatus = await GroupStatus_1.default.findById(groupStatusId);
        if (!groupStatus) {
            return res.status(408).json("no group created till now. ");
        }
        return res.send(groupStatus);
    }
    catch (error) {
        console.error("get Group Status Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getFindStatus = getFindStatus;
