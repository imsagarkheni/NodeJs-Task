const mongoConnection = require("../../utils/connections");
const responseManager = require("../../utils/response.manager");
const recipeModel = require("../../models/recipe.model");
const constants = require("../../utils/constants");

exports.getById = async (req, res) => {
  try {
    const primary = mongoConnection.useDb(constants.DEFAULT_DB);

    const recipe = await primary
      .model(constants.MODELS.recipe, recipeModel)
      .findOne({
        _id: req.params.id,
      })
      .lean();

    if (!recipe) {
      return responseManager.badRequest({ message: "Recipe not found" }, res);
    }

    return responseManager.onSuccess("Recipe fetched", recipe, res);
  } catch (err) {
    return responseManager.onError(err, res);
  }
};
