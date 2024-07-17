import client from "prom-client";

const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

//@ts-ignore
export const requestCount = (req, res, next) => {
  requestCounter.inc({
    method: req.method,
    route: req.route ? req.route.path : req.path,
  });
  next();
};
