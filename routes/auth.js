const checkDuplicateEmail = require("../middleware/verifySignUp");
const controller = require("../controller/auth.controller");
const multer = require('../middleware/upload')

const app = require("express").Router()


app.post("/signup", checkDuplicateEmail, multer.single('image'), controller.signup);
app.post("/signin", controller.signin);
app.get("/getall", controller.getAllUsers);
app.get("/getone/:id", controller.getOneUsers);
app.put("/update/:id", controller.update);
app.delete("/delete/:id", controller.deleteUser);
app.get("/searchname/:name", controller.searchByName);
app.get("/searchfield/:field", controller.searchByField);
app.get("/searchlocation/:location", controller.searchByLocation);

module.exports = app;