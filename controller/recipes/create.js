const fs = require("fs");
const path = require("path");
const mongoConnection = require("../../utils/connections");
const responseManager = require("../../utils/response.manager");
const recipeModel = require("../../models/recipe.model");
const constants = require("../../utils/constants");

exports.create = async (req, res) => {
  try {
    const primary = mongoConnection.useDb(constants.DEFAULT_DB);

    let ingredients = [];
    if (req.body.ingredients) {
      if (typeof req.body.ingredients === "string") {
        ingredients = JSON.parse(req.body.ingredients);
      } else {
        ingredients = req.body.ingredients;
      }
    }

    const payload = {
      heading: req.body.heading,
      shortDescription: req.body.shortDescription,
      longDescription: req.body.longDescription || "",
      prepTime: Number(req.body.prepTime) || 0,
      cookTime: Number(req.body.cookTime) || 0,
      ingredients: ingredients,
    };

    const Recipe = primary.model(constants.MODELS.recipe, recipeModel);
    const recipe = await Recipe.create(payload);

    if (req.file) {
      const ext = path.extname(req.file.originalname);
      const fileName = `${recipe._id}${ext}`;
      const filePath = path.join(__dirname, "../../public/uploads/recipes", fileName);

      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      fs.writeFileSync(filePath, req.file.buffer);

      recipe.image = fileName;
      await recipe.save();
    }

    return responseManager.onSuccess("Recipe created successfully", recipe, res);

  } catch (error) {
    console.error("Create recipe error:", error);
    return responseManager.onError(error, res);
  }
};
