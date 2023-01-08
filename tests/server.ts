import express from "express";
import shared from "./shared";
import png from "./1x1.png";

const app = express();

app.get("/", (req, res) => {
  res.write("Craq server response");
  res.write("\n");
  res.write(png);
  res.write("\n");
  res.write(shared);
  res.end();
});

app.listen(3001);
