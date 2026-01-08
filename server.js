import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Jarvish backend is running");
});

app.listen(3000, () => {
  console.log("Server running");
});
