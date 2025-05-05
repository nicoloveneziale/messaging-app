"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passportConfig_1 = __importDefault(require("../config/passportConfig"));
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
router.post("/login", passportConfig_1.default.authenticate("local", { session: false }), authController_1.loginController);
router.get("/protected", passportConfig_1.default.authenticate("jwt", { session: false }), authController_1.protectedRouteController);
router.post("/register", authController_1.registerUserController);
exports.default = router;
