require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// const Brand = require("../models/brand.model");
const Category = require("../models/category.model");
const Tag = require("../models/tag.model");
const Product = require("../models/product.model");
const Stock = require("../models/stock.model");
const Faq = require("../models/faq.model");
const User = require("../models/user.model");
const RatingReview = require("../models/ratingReview.model");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/AHM_Fragrances";

const shouldReset = process.argv.includes("--reset");

async function connectDB() {
  await mongoose.connect(MONGO_URI);

}

async function clearSeededCollections() {
  await Promise.all([
    RatingReview.deleteMany({}),
    Stock.deleteMany({}),
    Product.deleteMany({}),
    Tag.deleteMany({}),
    Category.deleteMany({}),
    // Brand.deleteMany({}),
    Faq.deleteMany({}),
    User.deleteMany({ email: { $in: ["demo@ahm.com", "admin@ahm.com"] } }),
  ]);
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash("password@123", 10);

  const users = await User.insertMany([
    {
      userName: "Demo User",
      email: "demo@ahm.com",
      phone: "03001234567",
      password: passwordHash,
      gender: "male",
      isEmailVerified: true,
      role: "user",
      isActive: true,
    },
    {
      userName: "Admin User",
      email: "admin@ahm.com",
      phone: "03007654321",
      password: passwordHash,
      gender: "female",
      isEmailVerified: true,
      role: "admin",
      isActive: true,
    },
  ]);

  return users;
}

async function seedCatalog() {
  const [men, women, unisex] = await Category.insertMany([
    { name: "men", description: "Fragrances curated for men." },
    { name: "women", description: "Elegant scents for women." },
    { name: "unisex", description: "Balanced fragrances for everyone." },
  ]);

  const [fresh, woody, floral, oriental] = await Tag.insertMany([
    { name: "Fresh", description: "Clean and citrus-forward notes." },
    { name: "Woody", description: "Warm woods and earthy tones." },
    { name: "Floral", description: "Soft floral bouquet notes." },
    { name: "Oriental", description: "Amber, spice, and resin notes." },
  ]);

  const [noirHouse, auraScents, velvetMist] = await Brand.insertMany([
    {
      brandName: "Noir House",
      country: "France",
      address: "Paris, France",
      brandRating: 4.4,
      description: "Modern niche fragrance house.",
    },
    {
      brandName: "Aura Scents",
      country: "Italy",
      address: "Milan, Italy",
      brandRating: 4.2,
      description: "Designer-inspired signature perfumes.",
    },
    {
      brandName: "Velvet Mist",
      country: "UAE",
      address: "Dubai, UAE",
      brandRating: 4.6,
      description: "Luxury oud and oriental blends.",
    },
  ]);

  const products = await Product.insertMany([
    {
      name: "Noir Ocean",
      price: 5500,
      discountPercentage: 10,
      description: "A fresh marine scent with a crisp woody dry down.",
      variants: [
        { size: "50ml", price: 5500, discountPercentage: 10 },
        { size: "100ml", price: 9200, discountPercentage: 12 },
      ],
      brand_id: noirHouse._id,
      category_id: men._id,
      tag_id: fresh._id,
      isActive: true,
      rating: 4.5,
    },
    {
      name: "Velvet Bloom",
      price: 6200,
      discountPercentage: 8,
      description: "Floral and fruity profile with a smooth musky base.",
      variants: [
        { size: "50ml", price: 6200, discountPercentage: 8 },
        { size: "100ml", price: 10200, discountPercentage: 10 },
      ],
      brand_id: auraScents._id,
      category_id: women._id,
      tag_id: floral._id,
      isActive: true,
      rating: 4.3,
    },
    {
      name: "Oud Ember",
      price: 7800,
      discountPercentage: 15,
      description: "Rich oud with amber and spice undertones.",
      variants: [
        { size: "50ml", price: 7800, discountPercentage: 15 },
        { size: "100ml", price: 12900, discountPercentage: 18 },
      ],
      brand_id: velvetMist._id,
      category_id: unisex._id,
      tag_id: oriental._id,
      isActive: true,
      rating: 4.7,
    },
    {
      name: "Cedar Trail",
      price: 5100,
      discountPercentage: 5,
      description: "Dry cedarwood opening with aromatic herbs and musk.",
      variants: [
        { size: "50ml", price: 5100, discountPercentage: 5 },
        { size: "100ml", price: 8600, discountPercentage: 7 },
      ],
      brand_id: noirHouse._id,
      category_id: men._id,
      tag_id: woody._id,
      isActive: true,
      rating: 4.1,
    },
  ]);

  await Stock.insertMany(
    products.map((product, index) => ({
      productId: product._id,
      quantity: 25 + index * 10,
      reservedQuantity: 0,
      lowStockThreshold: 8,
      lastRestockedAt: new Date(),
      stockHistory: [
        {
          previousQuantity: 0,
          newQuantity: 25 + index * 10,
          reason: "admin_restock",
          changedAt: new Date(),
        },
      ],
    }))
  );

  return products;
}

async function seedFaqs() {
  await Faq.insertMany([
    {
      question: "How long does delivery take?",
      answer: "Standard delivery takes 3-5 business days nationwide.",
    },
    {
      question: "Can I return a fragrance?",
      answer: "Yes, returns are accepted within 7 days if the box is unopened.",
    },
    {
      question: "Are these original perfumes?",
      answer: "Yes, all listed products are sourced from verified suppliers.",
    },
  ]);
}

async function seedReviews(users, products) {
  await RatingReview.insertMany([
    {
      userId: users[0]._id,
      productId: products[0]._id,
      rating: 5,
      review: "Excellent fresh scent and long-lasting performance.",
    },
    {
      userId: users[0]._id,
      productId: products[1]._id,
      rating: 4,
      review: "Beautiful floral opening, perfect for daily wear.",
    },
    {
      userId: users[1]._id,
      productId: products[2]._id,
      rating: 5,
      review: "Strong oud profile, premium quality and projection.",
    },
  ]);
}

async function runSeeder() {
  try {
    await connectDB();


    await clearSeededCollections();

    const users = await seedUsers();
    const products = await seedCatalog();
    await seedFaqs();
    await seedReviews(users, products);


  } catch (error) {
    console.error("Seeder failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();

  }
}

runSeeder();
