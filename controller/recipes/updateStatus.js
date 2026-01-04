const mongoConnection = require("../../utils/connections");
const responseManager = require("../../utils/response.manager");
const recipeModel = require("../../models/recipe.model");
const constants = require("../../utils/constants");

exports.updateStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    const primary = mongoConnection.useDb(constants.DEFAULT_DB);

    const recipe = await primary
      .model(constants.MODELS.recipe, recipeModel)
      .findOneAndUpdate(
        { _id: id },
        { status },
        { new: true }
      );

    if (!recipe) {
      return responseManager.badRequest({ message: "Recipe not found" }, res);
    }

    return responseManager.onSuccess("Status updated", recipe, res);
  } catch (err) {
    return responseManager.onError(err, res);
  }
};
