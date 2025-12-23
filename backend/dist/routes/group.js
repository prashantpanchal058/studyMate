"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const group_1 = require("../controllers/group");
const authUser_1 = __importDefault(require("../middleware/authUser"));
const router_group = express_1.default.Router();
router_group.post("/createGroup", [
    (0, express_validator_1.body)("desc", "description must be at least 10 characters").isLength({ min: 10 })
], authUser_1.default, group_1.createGroup);
router_group.get('/getGroup/:id', group_1.getGroup);
router_group.get('/getGroups', authUser_1.default, group_1.getGroups);
router_group.delete('/deleteGroup/:id', authUser_1.default, group_1.deleteGroup);
router_group.get('/getAllGroup/', authUser_1.default, group_1.getAllGroup);
exports.default = router_group;
