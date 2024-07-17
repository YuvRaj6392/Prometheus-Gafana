import express from "express";
import { requestCount } from "./monitoring/requestCount";
import client from "prom-client";

const app = express();

app.use(express.json());

app.use(requestCount);

app.get("/user", (req, res) => {
  res.json({
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
});

app.listen(3000, () => {
  console.log("server is listening at 3000");
});
