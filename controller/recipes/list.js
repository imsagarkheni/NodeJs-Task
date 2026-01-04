const mongoConnection = require("../../utils/connections");
const responseManager = require("../../utils/response.manager");
const recipeModel = require("../../models/recipe.model");
const constants = require("../../utils/constants");

exports.list = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", status } = req.body;

    const filter = {
      heading: { $regex: search, $options: "i" }
    };

    if (status !== undefined) filter.status = status;

    const primary = mongoConnection.useDb(constants.DEFAULT_DB);

    const result = await primary
      .model(constants.MODELS.recipe, recipeModel)
      .paginate(filter, {
        page,
        limit,
        sort: { createdAt: -1 },
        lean: true
      });

    return responseManager.onSuccess("Recipe list", result, res);
  } catch (err) {
    return responseManager.onError(err, res);
  }
};
