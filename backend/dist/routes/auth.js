"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authUser_1 = __importDefault(require("../middleware/authUser"));
const user_1 = require("../controllers/user");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post("/signup", [
    (0, express_validator_1.body)("name", "Name must be at least 6 characters").isLength({ min: 6 }),
    (0, express_validator_1.body)("email", "Enter a valid email").isEmail(),
    (0, express_validator_1.body)("password", "Password must be at least 6 characters").isLength({ min: 6 }),
], user_1.signup);
router.post("/signin", [
    (0, express_validator_1.body)("email", "Enter a valid email").isEmail(),
    (0, express_validator_1.body)("password", "Password must be at least 6 characters").isLength({ min: 6 }),
], user_1.signin);
router.get('/getuser', authUser_1.default, user_1.getUser);
exports.default = router;
