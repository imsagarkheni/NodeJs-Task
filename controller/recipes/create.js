const mongoConnection = require("../../utils/connections");
const responseManager = require("../../utils/response.manager");
const recipeModel = require("../../models/recipe.model");
const constants = require("../../utils/constants");

exports.create = async (req, res) => {
  try {
    const primary = mongoConnection.useDb(constants.DEFAULT_DB);
    const Recipe = primary.model(constants.MODELS.recipe, recipeModel);

    let ingredients = [];
    if (req.body.ingredients) {
      ingredients =
        typeof req.body.ingredients === "string"
          ? JSON.parse(req.body.ingredients)
          : req.body.ingredients;
    }

    let image = null;

    if (req.file && req.file.buffer) {
      image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const recipe = await Recipe.create({
      heading: req.body.heading,
      shortDescription: req.body.shortDescription,
      longDescription: req.body.longDescription || "",
      prepTime: Number(req.body.prepTime) || 0,
      cookTime: Number(req.body.cookTime) || 0,
      ingredients,
      image,
    });

    return responseManager.onSuccess(
      "Recipe created successfully",
      recipe,
      res
    );
  } catch (error) {
    console.error("Create recipe error:", error);
    return responseManager.onError(error, res);
  }
};
