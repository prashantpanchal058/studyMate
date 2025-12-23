import express from "express";
import fetchUser from "../middleware/authUser";
import { createGroupStatus, delGroupStatus, getAdminGroupStatus, getFindGroupStatus, getFindStatus, getrequestedGroupStatus, updateGroupStatus } from "../controllers/groupStatus";

const router_status = express.Router();

router_status.post("/sendGrouprequest/:id",fetchUser, createGroupStatus)

router_status.delete("/deleteGrouprequest/:id",fetchUser, delGroupStatus)

router_status.patch('/updateGroupStatus/:id',fetchUser, updateGroupStatus);

router_status.get('/getownerGroupStatus', fetchUser,getAdminGroupStatus);

router_status.get('/getrequestedGroupStatus', fetchUser,getrequestedGroupStatus);

router_status.get('/getGroupStatus/:id', getFindGroupStatus);

router_status.get('/getuserFind/:id', getFindStatus);

export default router_status;