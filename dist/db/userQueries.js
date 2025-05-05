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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.findUserById = exports.findUserByUsername = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const findUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.user.findUnique({ where: { username } });
    }
    catch (error) {
        console.log("Error finding user by username: ", error);
        throw error;
    }
});
exports.findUserByUsername = findUserByUsername;
const findUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma.user.findUnique({ where: { id } });
    }
    catch (error) {
        console.log("Error finding user by id: ", error);
        throw error;
    }
});
exports.findUserById = findUserById;
const createUser = (username, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = yield prisma.user.create({
            data: {
                username,
                email,
                password,
            },
        });
        return newUser;
    }
    catch (error) {
        console.log("Error creating user: ", error);
        throw error;
    }
});
exports.createUser = createUser;
