const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const link = require("./models/link");
port = process.env.PORT;

mongoose.connect(process.env.mongoURL);
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.post("/Shrink", async (req, res) => {
  await link.create({ full: req.body.FullURL });

  res.redirect("/");
});
app.get("/", async (req, res) => {
  const shrinks = await link.find();
  res.render("index.ejs", { Shrinks: shrinks });
});

app.get("/:Shrink", async (req, res) => {
  const turl = await link.findOne({ tiny: req.params.Shrink });
  if (turl == null) {
    return res.sendStatus(404);
  }
  turl.clicks++;
  turl.save();

  res.redirect(turl.full);
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
