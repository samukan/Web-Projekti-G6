"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
// Importoi reitit ja muut tarvittavat moduulit
// import authRoutes from './routes/authRoutes';
// import menuRoutes from './routes/menuRoutes';
// import orderRoutes from './routes/orderRoutes';
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
// Palvellaan staattisia tiedostoja public-kansiosta
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Palvellaan käännettyjä front-end-skriptejä
app.use('/scripts', express_1.default.static(path_1.default.join(__dirname, '../public-dist/scripts')));
// Muu middleware ja reitit
// app.use('/api/auth', authRoutes);
// app.use('/api/menu', menuRoutes);
// app.use('/api/orders', orderRoutes);
exports.default = app;
