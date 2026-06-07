require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Faq = require("../models/faq.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");

const MONGO_URI =
  process.env.DB_URL ||
  "mongodb://localhost:27017/ahm-fragrance";

const shouldReset = process.argv.includes("--reset");

async function connectDB() {
  await mongoose.connect(MONGO_URI);
}

async function clearSeededCollections() {
  await Promise.all([
    Faq.deleteMany({}), 
    User.deleteMany({ role: "admin" }),
    Product.deleteMany({}) 
  ]);
}

async function seedUsers() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@ahm.com";
  const adminPassword =
    process.env.SEED_ADMIN_PASSWORD ||
    (process.env.NODE_ENV === "production" ? "" : "password@123");

  if (!adminPassword) {
    throw new Error(
      "Missing SEED_ADMIN_PASSWORD. Set it before running seeder in production.",
    );
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const adminDoc = {
    userName: process.env.SEED_ADMIN_NAME || "Admin",
    email: adminEmail,
    phone: process.env.SEED_ADMIN_PHONE || "03007654321",
    password: passwordHash,
    gender: process.env.SEED_ADMIN_GENDER || "female",
    isEmailVerified: true,
    role: "admin",
    isActive: true,
  };

  const admin = await User.findOneAndUpdate(
    { email: adminEmail },
    { $set: adminDoc, $setOnInsert: { createdAt: new Date() } },
    { new: true, upsert: true },
  );

  return [admin];
}

async function seedFaqs() {
  const faqs = [
    {
      question: "Are your perfumes original and authentic?",
      answer:
        "Yes. We only list authentic products and source from verified channels. If you ever receive a damaged or suspicious item, contact support within 7 days for a quick resolution.",
    },
    {
      question: "How long does delivery take in Pakistan?",
      answer:
        "Most orders arrive in 3–5 working days. Delivery time can vary slightly by city and courier workload during sales.",
    },
    {
      question: "Do you offer Cash on Delivery (COD)?",
      answer:
        "Yes, COD is available in most cities across Pakistan. If COD is unavailable for your area, you’ll see alternative payment options at checkout.",
    },
    {
      question: "What is your return / exchange policy?",
      answer:
        "If your order arrives damaged or incorrect, we offer a hassle-free exchange/return within 7 days. Please keep the original packaging and share unboxing photos for faster processing.",
    },
    {
      question: "How can I choose the right fragrance for me?",
      answer:
        "Start with your vibe: fresh & clean (day), woody & warm (evening), or sweet & floral (signature). Check the notes and concentration on the product page—if you need help, message us and we’ll recommend based on your preferences.",
    },
    {
      question: "How long do AHM fragrances last?",
      answer:
        "Longevity depends on your skin type and environment, but most customers get all-day wear. For best results, apply on moisturized skin and pulse points (wrists, neck).",
    },
    {
      question: "Can I send an order as a gift?",
      answer:
        "Absolutely. Add your recipient’s address at checkout. If you’d like a gift note, include it in the order notes and we’ll pack it with extra care.",
    },
    {
      question: "How do I track my order?",
      answer:
        "Once dispatched, you’ll receive tracking details via SMS/email (where available). You can also contact support with your order number for an update.",
    },
    {
      question: "What should I do if I entered the wrong address/phone?",
      answer:
        "Contact us as soon as possible with your order number. If the parcel hasn’t shipped yet, we’ll update the details immediately.",
    },
    {
      question: "Are there any exclusive deals or sales?",
      answer:
        "Yes—limited-time discounts run throughout the year. Join our newsletter and follow our socials to get early access to drops and sale alerts.",
    }
  ];

  await Promise.all(
    faqs.map((faq) =>
      Faq.updateOne(
        { question: faq.question },
        { $set: faq },
        { upsert: true },
      ),
    ),
  );
}

//  Dummy Products Function Code
async function seedProducts() {
  const dummyProducts = [
    {
      name: "Luxury Oud Supreme",
      description: "An intense, long-lasting oriental woody fragrance perfect for evenings.",
      isActive: true,
      rating: 5,
      category_id: new mongoose.Types.ObjectId(), 
      tag_id: new mongoose.Types.ObjectId(),  
      image_id: [], 
      variants: [
        {
          size: "50ml",
          price: 3500,
          discountPercentage: 10, 
          stock: 10
        },
        {
          size: "100ml",
          price: 6000,
          discountPercentage: 15, 
          stock: 5
        }
      ]
    },
    {
      name: "Floral Bliss Essence",
      description: "A delightful mix of fresh jasmine and red roses for day-long freshness.",
      isActive: true,
      rating: 4.5,
      category_id: new mongoose.Types.ObjectId(),
      tag_id: new mongoose.Types.ObjectId(),
      image_id: [],
      variants: [
        {
          size: "30ml",
          price: 2500,
          discountPercentage: 0,
          stock: 25
        },
        {
          size: "100ml",
          price: 5000,
          discountPercentage: 20,
          stock: 12
        }
      ]
    },
    
  ];

  await Product.deleteMany({});
  await Product.insertMany(dummyProducts);
  console.log("  Variant Products Seeded Successfully!");
}

async function runSeeder() {
  try {
    console.log("Connecting to Database...");
    await connectDB();

    if (shouldReset) {
      await clearSeededCollections();
      console.log("Database cleared successfully.");
    }

    await seedUsers();
    await seedFaqs();
    await seedProducts(); 

    console.log("All Seeding completed successfully!");
  } catch (error) {
    console.error("Seeder failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed.");
  }
}

runSeeder();