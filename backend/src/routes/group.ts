import express from "express";
import { body } from "express-validator";
import { createGroup , getGroup, getGroups, deleteGroup, getAllGroup} from "../controllers/group";
import fetchUser from "../middleware/authUser";

const router_group = express.Router();

router_group.post("/createGroup",[
    body("desc", "description must be at least 10 characters").isLength({ min: 10 })
],fetchUser, createGroup)

router_group.get('/getGroup/:id', getGroup);

router_group.get('/getGroups',fetchUser, getGroups);

router_group.delete('/deleteGroup/:id',fetchUser, deleteGroup);

router_group.get('/getAllGroup/',fetchUser, getAllGroup);


export default router_group;