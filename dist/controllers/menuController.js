"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMenuItem = exports.updateMenuItem = exports.addMenuItem = exports.getMenu = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const menuFilePath = path_1.default.join(__dirname, "../../data/menu.json");
const getMenu = (req, res) => {
    fs_1.default.readFile(menuFilePath, "utf8", (err, data) => {
        if (err) {
            return res
                .status(500)
                .json({ message: "Ruokalistan lataaminen epäonnistui" });
        }
        const menu = JSON.parse(data);
        res.status(200).json(menu);
    });
};
exports.getMenu = getMenu;
const addMenuItem = (req, res) => {
    // Uuden ruoka-annoksen lisääminen
};
exports.addMenuItem = addMenuItem;
const updateMenuItem = (req, res) => {
    // Ruoka-annoksen päivittäminen
};
exports.updateMenuItem = updateMenuItem;
const deleteMenuItem = (req, res) => {
    // Ruoka-annoksen poistaminen
};
exports.deleteMenuItem = deleteMenuItem;
