"use strict";
// src/routes/menuRoutes.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.Router)();
router.get('/menu', (req, res) => {
    const menuPath = path_1.default.join(__dirname, '../../data/menu.json');
    fs_1.default.readFile(menuPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Virhe luettaessa menu.json-tiedostoa:', err);
            res.status(500).json({ message: 'Virhe ladattaessa ruokalistaa' });
            return;
        }
        try {
            const menu = JSON.parse(data);
            res.json(menu);
        }
        catch (parseError) {
            console.error('Virhe jäsennettäessä menu.json-tiedostoa:', parseError);
            res.status(500).json({ message: 'Virhe ladattaessa ruokalistaa' });
        }
    });
});
exports.default = router;
