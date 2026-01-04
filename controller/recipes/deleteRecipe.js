const mongoConnection = require("../../utils/connections");
const responseManager = require("../../utils/response.manager");
const recipeModel = require("../../models/recipe.model");
const constants = require("../../utils/constants");

const fs = require("fs");
const path = require("path");

exports.deleteRecipe = async (req, res) => {
  try {
    const primary = mongoConnection.useDb(constants.DEFAULT_DB);
    const Recipe = primary.model(constants.MODELS.recipe, recipeModel);

    const recipeId = req.params.id;

    const recipe = await Recipe.findByIdAndDelete(recipeId);
    if (!recipe) {
      return responseManager.onError("Recipe not found", res);
    }

    if (recipe.image) {
      const filePath = path.join(__dirname, "../../public/uploads/recipes", recipe.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    return responseManager.onSuccess("Recipe deleted successfully", null, res);

  } catch (error) {
    console.error("Delete recipe error:", error);
    return responseManager.onError(error, res);
  }
};
