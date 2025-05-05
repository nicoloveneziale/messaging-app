"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserController = exports.protectedRouteController = exports.loginController = void 0;
const passportConfig_1 = require("../config/passportConfig");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userQueries_1 = require("../db/userQueries");
const profileQueries_1 = require("../db/profileQueries");
const loginController = (req, res, next) => {
    if (req.user) {
        const token = (0, passportConfig_1.generateToken)(req.user);
        return res.status(200).json({ message: "Login successful", token: token });
    }
};
exports.loginController = loginController;
const protectedRouteController = (req, res, next) => {
    if (req.user) {
        return res.status(200).json({
            message: "Protected resource accessed",
        });
    }
    else {
        return res.status(401).json({ message: "Unauthorized" });
    }
};
exports.protectedRouteController = protectedRouteController;
const registerUserController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        //hash password for new user
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        //add user details to db
        const newUser = yield (0, userQueries_1.createUser)(username, email, password);
        //create a profile for the new user
        const newProfile = yield (0, profileQueries_1.createProfile)(newUser.id);
        //token generation for immidiate login
        const token = (0, passportConfig_1.generateToken)(newUser);
        return res
            .status(201)
            .json({ message: "User created successfully", token });
    }
    catch (error) {
        if (error.code === "P2002") {
            return res
                .status(409)
                .json({ message: "Username or email already taken" });
        }
        console.error("Error registering user:", error);
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
});
exports.registerUserController = registerUserController;
