const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ingredientSchema = new mongoose.Schema({
  label: { type: String, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true }
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  heading: { type: String, required: true, trim: true },
  shortDescription: { type: String, required: true },
  longDescription: { type: String },
  image: { type: String , default: "" },
  prepTime: { type: Number, required: true },
  cookTime: { type: Number, required: true },
  totalTime: { type: Number },
  ingredients: {
    type: [ingredientSchema],
    validate: v => v.length >= 1 && v.length <= 30
  },
  status: { type: Boolean, default: true }
}, { timestamps: true });

recipeSchema.pre("save", function () {
  this.totalTime = this.prepTime + this.cookTime;
});

recipeSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate();
  if (!update) return;

  const prepTime = update.prepTime ?? update.$set?.prepTime;
  const cookTime = update.cookTime ?? update.$set?.cookTime;

  if (prepTime !== undefined || cookTime !== undefined) {
    update.totalTime = (prepTime || 0) + (cookTime || 0);
  }
});

recipeSchema.plugin(mongoosePaginate);

module.exports = recipeSchema;
