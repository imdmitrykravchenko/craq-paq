import express from "express";
import shared from "./shared";

const app = express();

app.get("/", (req, res) => {
  res.write("Craq server response");
  res.write("\n");
  res.write(shared);
  res.end();
});

app.listen(3001);
