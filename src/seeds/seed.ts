import mongoose from "mongoose";
import { config } from "dotenv";
import bcrypt from "bcrypt";
import { User, UserSchema } from "@/db/schema/user.schema";
import { Category, CategorySchema } from "@/db/schema/category.schema";
import { Recipe, RecipeSchema } from "@/db/schema/recipe.schema";

config();

const DATABASE_URL = process.env.DATABASE_URL ?? "";

// Seed data
const categories = [
  {
    name: "Pasta & Risotto",
    description: "Italian pasta dishes and creamy risottos",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Grilled & BBQ",
    description: "Grilled meats, BBQ, and outdoor cooking",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Soups & Stews",
    description: "Hearty soups and slow-cooked stews",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Salads",
    description: "Fresh and healthy salad recipes",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Stir-fry",
    description: "Quick and easy stir-fried dishes",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Desserts",
    description: "Sweet treats and baked goods",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Appetizers",
    description: "Starters and finger foods",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Seafood",
    description: "Fresh fish and shellfish dishes",
    isDeleted: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const users = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@chongkran.com",
    role: "admin" as const,
    bio: "Platform administrator",
    avatar: "https://i.pravatar.cc/150?u=admin",
    followersCount: 0,
    followingCount: 0,
    recipesCount: 0,
    totalViews: 0,
    totalLikes: 0,
    isDeleted: false,
  },
  {
    firstName: "Marco",
    lastName: "Rossi",
    email: "marco@example.com",
    role: "author" as const,
    gender: "male",
    bio: "Professional chef specializing in Italian and Mediterranean cuisine",
    expertise: ["Italian", "Mediterranean", "Pasta"],
    avatar: "https://i.pravatar.cc/150?u=marco",
    website: "https://chefmarco.com",
    instagram: "@chefmarco",
    youtube: "@ChefMarcoKitchen",
    followersCount: 1250,
    followingCount: 45,
    recipesCount: 32,
    totalViews: 45000,
    totalLikes: 3200,
    isDeleted: false,
  },
  {
    firstName: "Emma",
    lastName: "Chen",
    email: "emma@example.com",
    role: "author" as const,
    gender: "female",
    bio: "Home cook and food blogger specializing in quick and healthy meals",
    expertise: ["Healthy", "Quick Meals", "Asian Fusion"],
    avatar: "https://i.pravatar.cc/150?u=emma",
    instagram: "@emma.cooks",
    tiktok: "@emmakitchen",
    followersCount: 890,
    followingCount: 120,
    recipesCount: 24,
    totalViews: 28500,
    totalLikes: 1950,
    isDeleted: false,
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    role: "user" as const,
    gender: "male",
    followersCount: 0,
    followingCount: 15,
    recipesCount: 0,
    totalViews: 0,
    totalLikes: 0,
    isDeleted: false,
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    role: "user" as const,
    gender: "female",
    followersCount: 0,
    followingCount: 28,
    recipesCount: 0,
    totalViews: 0,
    totalLikes: 0,
    isDeleted: false,
  },
];

const recipes = [
  {
    title: "Classic Spaghetti Carbonara",
    description:
      "Authentic Roman pasta dish with eggs, pecorino cheese, pancetta, and black pepper. Creamy without using any cream.",
    ingredients: [
      { name: "Spaghetti", quantity: "400g" },
      { name: "Pancetta or guanciale", quantity: "150g, cubed" },
      { name: "Egg yolks", quantity: "4" },
      { name: "Whole eggs", quantity: "2" },
      { name: "Pecorino Romano", quantity: "100g, grated" },
      { name: "Black pepper", quantity: "2 tsp, freshly ground" },
      { name: "Salt", quantity: "to taste" },
    ],
    steps: [
      "Bring a large pot of salted water to boil and cook spaghetti until al dente.",
      "While pasta cooks, crisp the pancetta in a large pan over medium heat.",
      "In a bowl, whisk together egg yolks, whole eggs, and most of the pecorino cheese.",
      "Reserve 1 cup of pasta water before draining.",
      "Add hot pasta to the pancetta pan (off heat).",
      "Quickly toss in egg mixture, stirring constantly to create a creamy sauce.",
      "Add pasta water as needed for consistency.",
      "Season with black pepper and serve with remaining cheese.",
    ],
    tags: ["pasta", "italian", "classic", "quick"],
    image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=600",
    cookTime: 25,
    difficulty: "medium" as const,
    status: "approved" as const,
  },
  {
    title: "Grilled Ribeye Steak with Herb Butter",
    description:
      "Perfectly grilled ribeye steak topped with homemade herb butter. A restaurant-quality meal at home.",
    ingredients: [
      { name: "Ribeye steaks", quantity: "2 (1-inch thick)" },
      { name: "Unsalted butter", quantity: "4 tbsp, softened" },
      { name: "Garlic", quantity: "2 cloves, minced" },
      { name: "Fresh rosemary", quantity: "1 tbsp, chopped" },
      { name: "Fresh thyme", quantity: "1 tbsp, chopped" },
      { name: "Olive oil", quantity: "2 tbsp" },
      { name: "Salt", quantity: "2 tsp" },
      { name: "Black pepper", quantity: "2 tsp" },
    ],
    steps: [
      "Mix softened butter with garlic, rosemary, and thyme. Roll into log and chill.",
      "Remove steaks from fridge 30 minutes before cooking.",
      "Rub steaks with olive oil, salt generously, and pepper.",
      "Preheat grill or pan to high heat.",
      "Sear steaks for 4-5 minutes per side for medium-rare.",
      "Rest steaks for 5 minutes before serving.",
      "Top with herb butter and enjoy.",
    ],
    tags: ["beef", "grilled", "dinner", "classic"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600",
    cookTime: 30,
    difficulty: "medium" as const,
    status: "approved" as const,
  },
  {
    title: "Classic Chicken Noodle Soup",
    description:
      "Comforting homemade chicken noodle soup with vegetables and egg noodles. Perfect for cold days.",
    ingredients: [
      { name: "Chicken thighs", quantity: "500g" },
      { name: "Egg noodles", quantity: "200g" },
      { name: "Carrots", quantity: "2, sliced" },
      { name: "Celery", quantity: "2 stalks, sliced" },
      { name: "Onion", quantity: "1, diced" },
      { name: "Garlic", quantity: "3 cloves, minced" },
      { name: "Chicken broth", quantity: "2L" },
      { name: "Bay leaves", quantity: "2" },
      { name: "Thyme", quantity: "1 tsp, dried" },
      { name: "Salt and pepper", quantity: "to taste" },
    ],
    steps: [
      "Heat oil in a large pot, brown chicken thighs on both sides. Set aside.",
      "Sauté onion, carrots, and celery for 5 minutes.",
      "Add garlic and cook for 1 minute.",
      "Return chicken to pot with broth, bay leaves, and thyme.",
      "Simmer for 30 minutes until chicken is cooked.",
      "Remove chicken, shred meat, and return to pot.",
      "Add noodles and cook for 8 minutes until tender.",
      "Season with salt and pepper before serving.",
    ],
    tags: ["soup", "chicken", "comfort", "healthy"],
    image: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600",
    cookTime: 50,
    difficulty: "easy" as const,
    status: "approved" as const,
  },
  {
    title: "Greek Salad",
    description:
      "Fresh Mediterranean salad with crisp vegetables, olives, and feta cheese in a simple olive oil dressing.",
    ingredients: [
      { name: "Cucumber", quantity: "1, diced" },
      { name: "Tomatoes", quantity: "2, chunked" },
      { name: "Red onion", quantity: "1/2, thinly sliced" },
      { name: "Bell pepper", quantity: "1, sliced" },
      { name: "Feta cheese", quantity: "200g, cubed" },
      { name: "Kalamata olives", quantity: "1/2 cup" },
      { name: "Olive oil", quantity: "4 tbsp" },
      { name: "Red wine vinegar", quantity: "2 tbsp" },
      { name: "Oregano", quantity: "1 tsp, dried" },
      { name: "Salt and pepper", quantity: "to taste" },
    ],
    steps: [
      "Combine cucumber, tomatoes, onion, and bell pepper in a large bowl.",
      "Add olives and feta cheese on top.",
      "Whisk together olive oil, vinegar, oregano, salt, and pepper.",
      "Drizzle dressing over salad and toss gently.",
      "Let sit for 10 minutes before serving to let flavors meld.",
      "Serve with crusty bread.",
    ],
    tags: ["salad", "mediterranean", "vegetarian", "quick"],
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600",
    cookTime: 15,
    difficulty: "easy" as const,
    status: "approved" as const,
  },
  {
    title: "Slow Cooked Beef Stew",
    description:
      "Tender beef and vegetables in a rich, hearty gravy. The perfect comfort food for cold weather.",
    ingredients: [
      { name: "Beef chuck", quantity: "800g, cubed" },
      { name: "Potatoes", quantity: "4, cubed" },
      { name: "Carrots", quantity: "3, chunked" },
      { name: "Onion", quantity: "2, chopped" },
      { name: "Beef broth", quantity: "500ml" },
      { name: "Red wine", quantity: "1 cup" },
      { name: "Tomato paste", quantity: "2 tbsp" },
      { name: "Flour", quantity: "3 tbsp" },
      { name: "Thyme and rosemary", quantity: "2 sprigs each" },
      { name: "Bay leaf", quantity: "1" },
      { name: "Oil", quantity: "2 tbsp" },
      { name: "Salt and pepper", quantity: "to taste" },
    ],
    steps: [
      "Preheat oven to 160°C (325°F).",
      "Toss beef in flour seasoned with salt and pepper.",
      "Brown beef in a Dutch oven with oil.",
      "Add onions and cook until softened.",
      "Stir in broth, wine, tomato paste, and herbs.",
      "Cover and bake for 2 hours.",
      "Add vegetables and bake for 1 more hour.",
      "Season to taste and serve.",
    ],
    tags: ["beef", "stew", "comfort", "slow cooked"],
    image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600",
    cookTime: 180,
    difficulty: "medium" as const,
    status: "approved" as const,
  },
  {
    title: "Classic Chocolate Chip Cookies",
    description:
      "Soft and chewy chocolate chip cookies with crispy edges. The classic homemade cookie everyone loves.",
    ingredients: [
      { name: "Butter", quantity: "150g, softened" },
      { name: "Brown sugar", quantity: "100g" },
      { name: "White sugar", quantity: "100g" },
      { name: "Eggs", quantity: "2" },
      { name: "Vanilla extract", quantity: "2 tsp" },
      { name: "Flour", quantity: "300g" },
      { name: "Baking soda", quantity: "1 tsp" },
      { name: "Salt", quantity: "1/2 tsp" },
      { name: "Chocolate chips", quantity: "300g" },
    ],
    steps: [
      "Preheat oven to 180°C (350°F) and line baking sheets.",
      "Cream butter and both sugars until fluffy.",
      "Beat in eggs and vanilla.",
      "Mix in flour, baking soda, and salt until just combined.",
      "Fold in chocolate chips.",
      "Scoop tablespoon-sized balls onto baking sheets.",
      "Bake for 10-12 minutes until golden brown.",
      "Cool on sheets for 5 minutes before transferring.",
    ],
    tags: ["dessert", "cookies", "baking", "classic"],
    image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600",
    cookTime: 30,
    difficulty: "easy" as const,
    status: "approved" as const,
  },
  {
    title: "Garlic Butter Shrimp Pasta",
    description:
      "Quick and flavorful pasta with succulent shrimp in a garlic butter sauce with lemon and parsley.",
    ingredients: [
      { name: "Linguine or spaghetti", quantity: "300g" },
      { name: "Shrimp", quantity: "400g, peeled" },
      { name: "Butter", quantity: "6 tbsp" },
      { name: "Garlic", quantity: "6 cloves, minced" },
      { name: "White wine", quantity: "1/3 cup" },
      { name: "Lemon juice", quantity: "2 tbsp" },
      { name: "Red chili flakes", quantity: "1/2 tsp" },
      { name: "Fresh parsley", quantity: "3 tbsp, chopped" },
      { name: "Parmesan", quantity: "50g, grated" },
      { name: "Salt and pepper", quantity: "to taste" },
    ],
    steps: [
      "Cook pasta according to package directions. Reserve 1 cup pasta water.",
      "Season shrimp with salt and pepper.",
      "Melt butter in a large pan over medium-high heat.",
      "Add garlic and chili flakes, cook for 30 seconds.",
      "Add shrimp and cook for 2-3 minutes per side until pink.",
      "Add white wine and lemon juice, simmer for 1 minute.",
      "Toss in pasta with pasta water as needed.",
      "Garnish with parsley and parmesan before serving.",
    ],
    tags: ["seafood", "pasta", "quick", "garlic"],
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600",
    cookTime: 20,
    difficulty: "easy" as const,
    status: "approved" as const,
  },
  {
    title: "Teriyaki Chicken Stir-Fry",
    description:
      "Tender chicken and colorful vegetables in a homemade sweet and savory teriyaki sauce.",
    ingredients: [
      { name: "Chicken breast", quantity: "400g, sliced" },
      { name: "Broccoli", quantity: "1 head, florets" },
      { name: "Bell peppers", quantity: "2, sliced" },
      { name: "Soy sauce", quantity: "4 tbsp" },
      { name: "Mirin", quantity: "3 tbsp" },
      { name: "Sake", quantity: "2 tbsp" },
      { name: "Sugar", quantity: "2 tbsp" },
      { name: "Ginger", quantity: "1 tbsp, grated" },
      { name: "Garlic", quantity: "3 cloves, minced" },
      { name: "Sesame oil", quantity: "2 tbsp" },
      { name: "Sesame seeds", quantity: "for garnish" },
    ],
    steps: [
      "Mix soy sauce, mirin, sake, sugar, ginger, and garlic for teriyaki sauce.",
      "Heat sesame oil in a wok over high heat.",
      "Stir-fry chicken until golden, about 4 minutes. Set aside.",
      "Add more oil if needed, stir-fry vegetables for 3 minutes.",
      "Return chicken to wok, pour in teriyaki sauce.",
      "Toss until sauce thickens and coats everything.",
      "Serve over steamed rice.",
      "Garnish with sesame seeds.",
    ],
    tags: ["stir-fry", "chicken", "asian", "quick"],
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600",
    cookTime: 25,
    difficulty: "easy" as const,
    status: "approved" as const,
  },
];

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(DATABASE_URL);
    console.log("Connected to MongoDB");

    // Get models
    const UserModel = mongoose.model<User>("User", UserSchema);
    const CategoryModel = mongoose.model<Category>("Category", CategorySchema);
    const RecipeModel = mongoose.model<Recipe>("Recipe", RecipeSchema);

    // Clear existing data
    console.log("Clearing existing data...");
    await UserModel.deleteMany({});
    await CategoryModel.deleteMany({});
    await RecipeModel.deleteMany({});

    // Seed categories
    console.log("Seeding categories...");
    const seededCategories = await CategoryModel.create(categories);
    console.log(`Created ${seededCategories.length} categories`);

    // Seed users with hashed passwords
    console.log("Seeding users...");
    const defaultPassword = await bcrypt.hash("Password123!", 10);

    const usersWithPasswords = users.map((user) => ({
      ...user,
      password: defaultPassword,
      refreshToken: "",
    }));

    const seededUsers = await UserModel.create(usersWithPasswords);
    console.log(`Created ${seededUsers.length} users`);

    // Get author and category IDs
    const author1 = seededUsers.find((u) => u.email === "marco@example.com")!._id;
    const author2 = seededUsers.find((u) => u.email === "emma@example.com")!._id;

    const pastaCategory = seededCategories.find((c) => c.name === "Pasta & Risotto")!._id;
    const grillCategory = seededCategories.find((c) => c.name === "Grilled & BBQ")!._id;
    const soupCategory = seededCategories.find((c) => c.name === "Soups & Stews")!._id;
    const saladCategory = seededCategories.find((c) => c.name === "Salads")!._id;
    const seafoodCategory = seededCategories.find((c) => c.name === "Seafood")!._id;
    const dessertCategory = seededCategories.find((c) => c.name === "Desserts")!._id;

    // Seed recipes with authors and categories
    console.log("Seeding recipes...");
    const recipesWithRelations = [
      {
        ...recipes[0],
        author: author1,
        category: pastaCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ...recipes[1],
        author: author1,
        category: grillCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ...recipes[2],
        author: author2,
        category: soupCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ...recipes[3],
        author: author2,
        category: saladCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ...recipes[4],
        author: author1,
        category: soupCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ...recipes[5],
        author: author2,
        category: dessertCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ...recipes[6],
        author: author1,
        category: seafoodCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        ...recipes[7],
        author: author2,
        category: pastaCategory,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    const seededRecipes = await RecipeModel.create(recipesWithRelations);
    console.log(`Created ${seededRecipes.length} recipes`);

    console.log("\n✅ Database seeded successfully!");
    console.log("\n📧 Test Accounts:");
    console.log("   Admin: admin@chongkran.com / Password123!");
    console.log("   Author: marco@example.com / Password123!");
    console.log("   Author: emma@example.com / Password123!");
    console.log("   User: john@example.com / Password123!");
    console.log("   User: jane@example.com / Password123!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB");
  }
}

// Run seed
seed();
