"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestCount = exports.activeUserCount = exports.bucketCount = exports.httpRequestDurationMicroseconds = void 0;
const prom_client_1 = __importDefault(require("prom-client"));
const requestCounter = new prom_client_1.default.Counter({
    name: "http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: ["method", "route", "status_code"],
});
const activeUserGauge = new prom_client_1.default.Gauge({
    name: "active_users",
    help: "Total number of requests whose request has not been resolved",
});
exports.httpRequestDurationMicroseconds = new prom_client_1.default.Histogram({
    name: "http_request_duration_ms",
    help: "Duration of HTTP requests in ms",
    labelNames: ["method", "route", "code"],
    buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000], // Define your own buckets here
});
//@ts-ignore
const bucketCount = (req, res, next) => {
    const startTime = Date.now();
    res.on("finish", () => {
        const endTime = Date.now();
        exports.httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode,
        }, endTime - startTime);
    });
    next();
};
exports.bucketCount = bucketCount;
//@ts-ignore
const activeUserCount = (req, res, next) => {
    activeUserGauge.inc();
    res.on("finish", () => {
        activeUserGauge.dec();
    });
    next();
};
exports.activeUserCount = activeUserCount;
//@ts-ignore
const requestCount = (req, res, next) => {
    requestCounter.inc({
        method: req.method,
        route: req.route ? req.route.path : req.path,
    });
    next();
};
exports.requestCount = requestCount;
