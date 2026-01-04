const fs = require("fs");
const path = require("path");
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

    let imagePath = "";
    
    if (req.file && req.file.buffer) {
      const timestamp = Date.now();
      const ext = path.extname(req.file.originalname);
      const fileName = `${timestamp}${ext}`;
      const uploadDir = path.join(__dirname, "../../public/uploads/recipe");
      const filePath = path.join(uploadDir, fileName);

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      fs.writeFileSync(filePath, req.file.buffer);
      imagePath = `public/uploads/recipe/${fileName}`;
    }

    const recipe = await Recipe.create({
      heading: req.body.heading,
      shortDescription: req.body.shortDescription,
      longDescription: req.body.longDescription || "",
      prepTime: Number(req.body.prepTime) || 0,
      cookTime: Number(req.body.cookTime) || 0,
      ingredients,
      image: imagePath,
    });

    const finalRecipe = await Recipe.findById(recipe._id);

    return responseManager.onSuccess(
      "Recipe created successfully",
      finalRecipe,
      res
    );
  } catch (error) {
    console.error("Create recipe error:", error);
    return responseManager.onError(error, res);
  }
};
