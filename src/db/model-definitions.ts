import type { ModelDefinition } from "@nestjs/mongoose";
import type { Schema } from "mongoose";

import { Category, CategorySchema } from "@/db/schema/category.schema";
import { MealPlan, MealPlanSchema } from "@/db/schema/meal-plan.schema";
import { Recipe, RecipeSchema } from "@/db/schema/recipe.schema";
import { ShoppingList, ShoppingListSchema } from "@/db/schema/shopping-list.schema";
import { User, UserSchema } from "@/db/schema/user.schema";

function withIdTransform(schema: Schema): Schema {
  schema.set("toJSON", {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id?.toString();
      delete ret._id;
      delete (ret as any).__v;
      return ret;
    },
  });
  return schema;
}

export const CATEGORY_MODEL = {
  name: Category.name,
  schema: withIdTransform(CategorySchema),
} satisfies ModelDefinition;

export const MEAL_PLAN_MODEL = {
  name: MealPlan.name,
  schema: withIdTransform(MealPlanSchema),
} satisfies ModelDefinition;

export const RECIPE_MODEL = {
  name: Recipe.name,
  schema: withIdTransform(RecipeSchema),
} satisfies ModelDefinition;

export const SHOPPING_LIST_MODEL = {
  name: ShoppingList.name,
  schema: withIdTransform(ShoppingListSchema),
} satisfies ModelDefinition;

export const USER_MODEL = {
  name: User.name,
  schema: withIdTransform(UserSchema),
} satisfies ModelDefinition;
