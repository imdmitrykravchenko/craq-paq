import express from "express";
import shared from "./shared";
const code = "I am a lovely server code";

console.log(code, shared);

const app = express();

app.get("/", (req, res) => {
  res.write("Craq server response");
  res.end();
});


app.listen(3001);
