import client from "prom-client";

const requestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const activeUserGauge = new client.Gauge({
  name: "active_users",
  help: "Total number of requests whose request has not been resolved",
});

export const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000], // Define your own buckets here
});

//@ts-ignore
export const bucketCount = (req, res, next) => {
  const startTime = Date.now();
  res.on("finish", () => {
    const endTime = Date.now();
    httpRequestDurationMicroseconds.observe(
      {
        method: req.method,
        route: req.route ? req.route.path : req.path,
        code: res.statusCode,
      },
      endTime - startTime
    );
  });
  next();
};

//@ts-ignore
export const activeUserCount = (req, res, next) => {
  activeUserGauge.inc();

  res.on("finish", () => {
    activeUserGauge.dec();
  });

  next();
};

//@ts-ignore
export const requestCount = (req, res, next) => {
  requestCounter.inc({
    method: req.method,
    route: req.route ? req.route.path : req.path,
  });
  next();
};
