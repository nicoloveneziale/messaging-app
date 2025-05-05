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
exports.generateToken = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userQueries_1 = require("../db/userQueries");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userQueries_1.findUserByUsername)(username);
        if (!user) {
            return done(null, false, { message: "Incorrect username." });
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
    }
    catch (error) {
        console.error("Error during login:", error);
        return done(error);
    }
})));
passport_1.default.use(new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
}, (jwtPayload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, userQueries_1.findUserById)(jwtPayload.sub);
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    }
    catch (error) {
        return done(error, false);
    }
})));
const generateToken = (user) => {
    const payload = {
        sub: user.id,
        username: user.username,
    };
    const options = {
        expiresIn: "1h",
    };
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, options);
};
exports.generateToken = generateToken;
exports.default = passport_1.default;
