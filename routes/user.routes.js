module.exports = app => {
    const users = require("../controllers/user.controller.js");
    var router = require("express").Router();
    // Create a new Tutorial
    router.post("/create", users.create);
    router.post("/login", users.logUser);
    router.get("/all", users.findAll);
    router.put("/update/:id", users.update)
    router.put("/asign-rol/:id", users.updateUserRol)
   
    app.use('/api/usuario', router);
  };