"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllGroup = exports.deleteGroup = exports.getGroups = exports.getGroup = exports.createGroup = void 0;
const Group_1 = __importDefault(require("../models/Group"));
const express_validator_1 = require("express-validator");
const createGroup = async (req, res) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { topic, subtopic, desc, time, days } = req.body;
        if (!topic || !subtopic || !desc || !time || !days) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized: User not found" });
        }
        const alreadyGroup = await Group_1.default.findOne({ topic, subtopic, desc, time, days });
        if (alreadyGroup) {
            return res.status(409).json({
                error: "This group already exists",
            });
        }
        // Create group
        const group = new Group_1.default({
            topic,
            subtopic,
            desc,
            time,
            days,
            userId,
        });
        await group.save();
        return res.status(201).json({ msg: "Group created successfully", group });
    }
    catch (error) {
        console.error("Create Group Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.createGroup = createGroup;
const getGroup = async (req, res) => {
    try {
        const groupid = await Group_1.default.findById(req.params.id);
        if (!groupid) {
            return res.status(404).json("error in getting group info.");
        }
        return res.send(groupid);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
};
exports.getGroup = getGroup;
const getGroups = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const groups = await Group_1.default.find({ userId: userId }).sort({ createdAt: -1 });
        if (!groups) {
            return res.status(404).json("error in getting groups.");
        }
        return res.send(groups);
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
};
exports.getGroups = getGroups;
const deleteGroup = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const group = await Group_1.default.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }
        await group.deleteOne();
        return res.json({ message: "group deleted successfully" });
    }
    catch (error) {
        return res.status(500).send({ error: "Internal Server Error" });
    }
};
exports.deleteGroup = deleteGroup;
const getAllGroup = async (req, res) => {
    try {
        const userId = req.user?.id;
        let query = {};
        if (userId) {
            query = { userId: { $ne: userId } };
        }
        const groups = await Group_1.default.find(query).sort({ createdAt: -1 });
        if (!groups || groups.length === 0) {
            return res.status(404).json("Groups are not available");
        }
        return res.json(groups);
    }
    catch (error) {
        console.error("Error in getAllGroup:", error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
};
exports.getAllGroup = getAllGroup;
