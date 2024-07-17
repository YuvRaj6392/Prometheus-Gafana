import express from "express";
import { requestCount } from "./monitoring/requestCount";
import client from "prom-client";
import winston from "winston";

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.cli(),
  transports: [new winston.transports.Console()],
});

const app = express();

app.use(express.json());

app.use(requestCount);

app.get("/user", (req, res) => {
  logger.error('yuvraj')
  res.status(200).json({
    name: "yuvraj",
  });
});

app.post("/user", (req, res) => {
  res.json({
    name: "yuvraj",
  });
});

app.get("/metrics", async (req, res) => {
  const metrics = await client.register.metrics();
  res.set("Content-Type", client.register.contentType);
  res.end(metrics);
  logger.info(metrics)
});

app.listen(3000, () => {
  console.log("server is listening at 3000");
});
