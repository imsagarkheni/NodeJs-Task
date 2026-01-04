const express = require("express");
const router = express.Router();
const { memoryUpload } = require("../../../utils/multer");

const creatRecipeCtrl = require("../../../controller/recipes/create");
const listRecipeCtrl = require("../../../controller/recipes/list");
const getByIdRecipeCtrl = require("../../../controller/recipes/getById");
const updateStatusCtrl = require("../../../controller/recipes/updateStatus");
const getRecipeWithServesCtrl = require("../../../controller/recipes/getRecipeWithServes");
const deleteRecipe = require("../../../controller/recipes/deleteRecipe");

router.post("/create", memoryUpload.single("image"), creatRecipeCtrl.create);

router.post("/list", listRecipeCtrl.list);

router.get("/:id", getByIdRecipeCtrl.getById);

router.get("/serves/:id", getRecipeWithServesCtrl.getRecipeWithServes);
router.delete("/:id", deleteRecipe.deleteRecipe);
router.patch("/status", updateStatusCtrl.updateStatus);

module.exports = router;
