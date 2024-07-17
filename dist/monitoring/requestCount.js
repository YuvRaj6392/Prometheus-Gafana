"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestCount = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
const requestCounter = new prom_client_1.default.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
});
//@ts-ignore
const requestCount = (req, res, next) => {
    requestCounter.inc({
        method: req.method,
        route: req.route ? req.route.path : req.path,
    });
    next();
};
exports.requestCount = requestCount;
