"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = exports.authenticateUser = void 0;
const authenticateUser = (req, res, next) => {
    // Tarkista JWT-token
};
exports.authenticateUser = authenticateUser;
const authenticateAdmin = (req, res, next) => {
    // Tarkista, että käyttäjä on admin
};
exports.authenticateAdmin = authenticateAdmin;
