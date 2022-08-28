const auth = require("../middleware/auth");
module.exports = app => {
    const users = require("../controllers/user.controller.js");
    var router = require("express").Router();
    // Create a new Tutorial
    router.post("/create", users.create);
    router.post("/login", users.logUser);
    router.get("/all", users.findAll);
    router.put("/update", users.update)
    router.put("/asign-rol/:id", users.updateUserRol)
    router.post("/send-code/:type", users.sendCode)
    router.post("/change-password",users.newPassword)
    router.post("/activate-user",users.activateUser)
    router.post("/welcome", users.check);
    app.use('/api/usuario', router);
  };