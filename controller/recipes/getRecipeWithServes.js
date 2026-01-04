const mongoConnection = require("../../utils/connections");
const responseManager = require("../../utils/response.manager");
const recipeModel = require("../../models/recipe.model");
const constants = require("../../utils/constants");

exports.getRecipeWithServes = async (req, res) => {
  try {
    const primary = mongoConnection.useDb(constants.DEFAULT_DB);
    const Recipe = primary.model(constants.MODELS.recipe, recipeModel);

    const recipeId = req.params.id;
    const servers = Number(req.query.servers) || 1;

    const recipe = await Recipe.findById(recipeId).lean();
    if (!recipe) {
      return responseManager.onError("Recipe not found", res);
    }

    if (recipe.ingredients && servers !== 1) {
      recipe.ingredients = recipe.ingredients.map((i) => ({
        ...i,
        quantity: i.quantity * servers,
      }));
    }

    return responseManager.onSuccess(
      "Recipe fetched successfully",
      recipe,
      res
    );
  } catch (error) {
    console.error(error);
    return responseManager.onError(error, res);
  }
};
