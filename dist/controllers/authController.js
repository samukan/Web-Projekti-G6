"use strict";
// src/controllers/authController.ts
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
exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../utils/db"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Tarkista, että sähköposti ja salasana on annettu
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Sähköposti ja salasana vaaditaan" });
        }
        // Tarkista, onko käyttäjä jo olemassa
        const [rows] = yield db_1.default.execute("SELECT * FROM Users WHERE email = ?", [
            email,
        ]);
        if (rows.length > 0) {
            return res.status(400).json({ message: "Sähköposti on jo käytössä" });
        }
        // Hashaa salasana
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        // Lisää käyttäjä tietokantaan
        yield db_1.default.execute("INSERT INTO Users (role_id, email, password) VALUES (?, ?, ?)", [
            2, // Oletetaan, että rooli 2 on 'Asiakas'
            email,
            hashedPassword,
        ]);
        res.status(201).json({ message: "Rekisteröityminen onnistui" });
    }
    catch (error) {
        res.status(500).json({ message: "Palvelinvirhe", error });
    }
});
exports.registerUser = registerUser;
