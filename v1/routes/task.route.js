const express = require("express");
const router = express.Router();

const controller = require("../controllers/task.controller");

router.get("/", controller.index);

router.get("/detail/:id", controller.detail);

router.patch("/change-status/:id", controller.changeStatus);

router.patch("/change-multi", controller.changeMulti);

router.post("/create", controller.create);

router.patch("/edit/:id", controller.edit);

router.post("/delete/:id", controller.delete);

router.post("/delete-multi", controller.deleteMulti);


module.exports = router;