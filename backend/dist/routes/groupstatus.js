"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authUser_1 = __importDefault(require("../middleware/authUser"));
const groupStatus_1 = require("../controllers/groupStatus");
const router_status = express_1.default.Router();
router_status.post("/sendGrouprequest/:id", authUser_1.default, groupStatus_1.createGroupStatus);
router_status.delete("/deleteGrouprequest/:id", authUser_1.default, groupStatus_1.delGroupStatus);
router_status.patch('/updateGroupStatus/:id', authUser_1.default, groupStatus_1.updateGroupStatus);
router_status.get('/getownerGroupStatus', authUser_1.default, groupStatus_1.getAdminGroupStatus);
router_status.get('/getrequestedGroupStatus', authUser_1.default, groupStatus_1.getrequestedGroupStatus);
router_status.get('/getGroupStatus/:id', groupStatus_1.getFindGroupStatus);
router_status.get('/getuserFind/:id', groupStatus_1.getFindStatus);
exports.default = router_status;
