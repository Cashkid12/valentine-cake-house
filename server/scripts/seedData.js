import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Cake from '../models/Cake.js';

dotenv.config();

const sampleCakes = [
  {
    name: "Chocolate Dream Birthday Cake",
    description: "Rich chocolate cake with creamy chocolate frosting and chocolate shavings",
    price: 2800,
    images: ["chocolate-birthday.jpg"],
    category: "birthday",
    flavor: "chocolate",
    size: "medium",
    featured: true,
    available: true,
    customizations: ["Message", "Color", "Toppers"]
  },
  {
    name: "Elegant Vanilla Wedding Cake",
    description: "Three-tier vanilla cake with buttercream flowers and gold leaf accents",
    price: 18500,
    images: ["vanilla-wedding.jpg"],
    category: "wedding",
    flavor: "vanilla",
    size: "large",
    featured: true,
    available: true,
    customizations: ["Tier size", "Flowers", "Color scheme"]
  },
  {
    name: "Rainbow Kids Cake",
    description: "Colorful vanilla cake with rainbow layers and fun sprinkles",
    price: 2200,
    images: ["rainbow-kids.jpg"],
    category: "kids",
    flavor: "vanilla",
    size: "medium",
    featured: false,
    available: true,
    customizations: ["Character", "Colors", "Message"]
  },
  {
    name: "Red Velvet Anniversary Cake",
    description: "Classic red velvet cake with cream cheese frosting and fresh berries",
    price: 3500,
    images: ["red-velvet-anniversary.jpg"],
    category: "anniversary",
    flavor: "red-velvet",
    size: "medium",
    featured: true,
    available: true,
    customizations: ["Message", "Berries", "Decoration"]
  },
  {
    name: "Lemon Graduation Cake",
    description: "Zesty lemon cake with lemon buttercream and graduation cap topper",
    price: 3200,
    images: ["lemon-graduation.jpg"],
    category: "graduation",
    flavor: "lemon",
    size: "medium",
    featured: false,
    available: true,
    customizations: ["School colors", "Message", "Year"]
  },
  {
    name: "Strawberry Delight Cake",
    description: "Fresh strawberry cake with strawberry filling and whipped cream frosting",
    price: 2700,
    images: ["strawberry-delight.jpg"],
    category: "birthday",
    flavor: "strawberry",
    size: "medium",
    featured: false,
    available: true,
    customizations: ["Fresh fruits", "Message", "Design"]
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing cakes
    await Cake.deleteMany({});
    console.log('Cleared existing cakes');

    // Insert sample cakes
    await Cake.insertMany(sampleCakes);
    console.log('Sample cakes inserted successfully');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();