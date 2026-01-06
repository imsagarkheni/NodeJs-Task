const mongoConnection = require("../../utils/connections");
const responseManager = require("../../utils/response.manager");
const recipeModel = require("../../models/recipe.model");
const constants = require("../../utils/constants");

exports.getById = async (req, res) => {
  try {
    const primary = mongoConnection.useDb(constants.DEFAULT_DB);

    const Recipe = primary.model(constants.MODELS.recipe, recipeModel);
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe || !recipe.image?.data) {
      return res.status(404).send("Image not found");
    }

    res.set("Content-Type", recipe.image.contentType);
    res.send(recipe.image.data);
  } catch (err) {
    return responseManager.onError(err, res);
  }
};
