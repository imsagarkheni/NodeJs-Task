const express = require("express");
const router = express.Router();
const { memoryUpload } = require("../../../utils/multer");
const helper = require("../../../utils/helper");

const creatRecipeCtrl = require("../../../controller/recipes/create");
const listRecipeCtrl = require("../../../controller/recipes/list");
const getByIdRecipeCtrl = require("../../../controller/recipes/getById");
const updateStatusCtrl = require("../../../controller/recipes/updateStatus");
const getRecipeWithServesCtrl = require("../../../controller/recipes/getRecipeWithServes");
const deleteRecipe = require("../../../controller/recipes/deleteRecipe");

router.post("/create", memoryUpload.single("image"),helper.authenticateToken, creatRecipeCtrl.create);

router.post("/list",helper.authenticateToken, listRecipeCtrl.list);

router.get("/:id",helper.authenticateToken, getByIdRecipeCtrl.getById);

router.get("/serves/:id",helper.authenticateToken, getRecipeWithServesCtrl.getRecipeWithServes);
router.delete("/:id",helper.authenticateToken, deleteRecipe.deleteRecipe);
router.patch("/status", helper.authenticateToken,updateStatusCtrl.updateStatus);

module.exports = router;
