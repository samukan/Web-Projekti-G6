"use strict";
// src/app.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const menuRoutes_1 = __importDefault(require("./routes/menuRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const app = (0, express_1.default)();
// Parse incoming JSON requests
app.use(body_parser_1.default.json());
// Serve frontend assets
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Serve compiled frontend scripts
app.use('/scripts', express_1.default.static(path_1.default.join(__dirname, '../public-dist/scripts')));
// API routes
app.use('/admin', adminRoutes_1.default);
app.use('/api', menuRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
// Fallback for unhandled requests (404)
app.use((req, res, next) => {
    res.status(404).send('Page not found');
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});
exports.default = app;
