//////////////////////////////////////////////////
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
//////////////////////////////////////////////////
dotenv.config();
//////////////////////////////////////////////////
const app = express();
const v1 = require("./route/v1");
//////////////////////////////////////////////////
app.use(express.json());
app.use(express.urlencoded({ extended: "Y" }));
app.use(cors());
app.use(express.static(path.join(__dirname + "/Assets")));
//////////////////////////////////////////////////
app.get("/", (req, res) => {
  res.send(
    "<div style><h1>PETHUB.com</h1><p>Hello this is pethub.com api please refer to the API documentation for details</p>"
  );
});
//////////////////////////////////////////////////
app.use(v1);
//////////////////////////////////////////////////
const Port = process.env.PORT || 8000;
//////////////////////////////////////////////////
app.listen(Port, () => {
  console.log(`Server Connected at ${Port}`.toUpperCase());
});
