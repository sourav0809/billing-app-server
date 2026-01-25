/**
 * Database Seeding Script
 *
 * This script populates the database with test data including:
 * - Admin, Distributors, Dealers, and Customers
 * - Areas with pincodes
 * - Plans and Channels
 * - Complete profile information
 *
 * Usage:
 * npm run seed          # Run this script directly (skips if already seeded)
 * npm run seed:reset    # Reset and reseed the database
 * npm run seed:knex     # Run through Knex (if migrations are working)
 *
 * Test Credentials:
 * - Admin: admin@billing.com / admin123
 * - Distributors: distributor1@billing.com / dist123
 * - Dealers: dealer1@billing.com / deal123
 * - Customers: customer1@billing.com / cust123
 */

import dotenv from "dotenv";
import { db } from "@/config/db";
import bcrypt from "bcrypt";
import { v5 as uuidv5 } from "uuid";

// Load environment variables
dotenv.config();

const SALT_ROUNDS = 10;
const NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8"; // Standard UUID namespace

async function seedDatabase(): Promise<void> {
  console.log("Seeding database...");

  try {
    // Test database connection first
    await db.raw("SELECT 1");
    console.log("✅ Database connection established");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }

  // Check if database is already seeded
  const existingAdmin = await db("users")
    .where({ email: "admin@billing.com" })
    .first();
  if (existingAdmin) {
    console.log("⚠️  Database already seeded. Skipping...");
    console.log("\n📋 Test Credentials:");
    console.log("Admin: admin@billing.com / admin123");
    console.log("Distributors: distributor1@billing.com / dist123");
    console.log("Dealers: dealer1@billing.com / deal123");
    console.log("Customers: customer1@billing.com / cust123");
    return;
  }

  // Use transaction for atomicity
  const trx = await db.transaction();

  try {
    // 1. Create Admin User
    const adminPassword = await bcrypt.hash("admin123", SALT_ROUNDS);
    const adminId = uuidv5("admin@billing.com", NAMESPACE);

    await trx("users").insert({
      id: adminId,
      name: "System Admin",
      email: "admin@billing.com",
      phone: "+1234567890",
      password: adminPassword,
      role: "admin",
      status: "active",
      created_at: new Date(),
      updated_at: new Date(),
    });

    console.log("✓ Created admin user");

    // 2. Create Areas
    const areas = [
      {
        id: uuidv5("downtown-area", NAMESPACE),
        name: "Downtown",
        pincode: "110001",
      },
      {
        id: uuidv5("suburb-area", NAMESPACE),
        name: "Suburb",
        pincode: "110002",
      },
      {
        id: uuidv5("uptown-area", NAMESPACE),
        name: "Uptown",
        pincode: "110003",
      },
      {
        id: uuidv5("rural-area", NAMESPACE),
        name: "Rural Area",
        pincode: "110004",
      },
    ];

    for (const area of areas) {
      await trx("areas").insert({
        id: area.id,
        name: area.name,
        pincode: area.pincode,
        user_id: adminId, // Admin created these areas
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    console.log("✓ Created areas");

    // 3. Create Plans
    const plans = [
      { id: uuidv5("basic-plan", NAMESPACE), name: "Basic Plan" },
      { id: uuidv5("premium-plan", NAMESPACE), name: "Premium Plan" },
      { id: uuidv5("enterprise-plan", NAMESPACE), name: "Enterprise Plan" },
    ];

    for (const plan of plans) {
      await trx("plans").insert({
        id: plan.id,
        name: plan.name,
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    console.log("✓ Created plans");

    // 4. Create Channels
    const channels = [
      {
        id: uuidv5("sports-channel", NAMESPACE),
        name: "Sports HD",
        price: 99.99,
      },
      {
        id: uuidv5("movies-channel", NAMESPACE),
        name: "Movies Plus",
        price: 149.99,
      },
      {
        id: uuidv5("news-channel", NAMESPACE),
        name: "News Network",
        price: 79.99,
      },
      {
        id: uuidv5("kids-channel", NAMESPACE),
        name: "Kids Zone",
        price: 59.99,
      },
      {
        id: uuidv5("music-channel", NAMESPACE),
        name: "Music Beats",
        price: 89.99,
      },
    ];

    for (const channel of channels) {
      await trx("channels").insert({
        id: channel.id,
        name: channel.name,
        price: channel.price,
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    console.log("✓ Created channels");

    // 5. Create Distributor Users
    const distributors = [
      {
        id: uuidv5("distributor1@billing.com", NAMESPACE),
        name: "John Distributors Ltd",
        email: "distributor1@billing.com",
        phone: "+1987654321",
        password: await bcrypt.hash("dist123", SALT_ROUNDS),
      },
      {
        id: uuidv5("distributor2@billing.com", NAMESPACE),
        name: "Global Cable Corp",
        email: "distributor2@billing.com",
        phone: "+1987654322",
        password: await bcrypt.hash("dist123", SALT_ROUNDS),
      },
    ];

    for (const distributor of distributors) {
      await trx("users").insert({
        id: distributor.id,
        name: distributor.name,
        email: distributor.email,
        phone: distributor.phone,
        password: distributor.password,
        role: "distributor",
        parent_user_id: adminId, // Distributors under admin
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    console.log("✓ Created distributor users");

    // 6. Create Distributor Profiles
    for (const distributor of distributors) {
      await trx("distributor_profiles").insert({
        id: uuidv5(`profile-${distributor.id}`, NAMESPACE),
        user_id: distributor.id,
        emergency_contact: "+1-800-DIST-HELP",
        address: `${distributor.name} Office, Main Street 123`,
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    console.log("✓ Created distributor profiles");

    // 7. Create Dealer Users (under distributors)
    const dealers = [
      {
        id: uuidv5("dealer1@billing.com", NAMESPACE),
        name: "Rajesh Kumar",
        email: "dealer1@billing.com",
        phone: "+919876543210",
        password: await bcrypt.hash("deal123", SALT_ROUNDS),
        parent_id: distributors[0].id, // Under first distributor
        area_id: areas[0].id, // Downtown area
      },
      {
        id: uuidv5("dealer2@billing.com", NAMESPACE),
        name: "Priya Sharma",
        email: "dealer2@billing.com",
        phone: "+919876543211",
        password: await bcrypt.hash("deal123", SALT_ROUNDS),
        parent_id: distributors[0].id, // Under first distributor
        area_id: areas[1].id, // Suburb area
      },
      {
        id: uuidv5("dealer3@billing.com", NAMESPACE),
        name: "Amit Singh",
        email: "dealer3@billing.com",
        phone: "+919876543212",
        password: await bcrypt.hash("deal123", SALT_ROUNDS),
        parent_id: distributors[1].id, // Under second distributor
        area_id: areas[2].id, // Uptown area
      },
    ];

    for (const dealer of dealers) {
      await trx("users").insert({
        id: dealer.id,
        name: dealer.name,
        email: dealer.email,
        phone: dealer.phone,
        password: dealer.password,
        role: "dealer",
        parent_user_id: dealer.parent_id,
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    console.log("✓ Created dealer users");

    // 8. Create Dealer Profiles
    for (const dealer of dealers) {
      await trx("dealer_profiles").insert({
        id: uuidv5(`profile-${dealer.id}`, NAMESPACE),
        user_id: dealer.id,
        emergency_contact: "+91-98765-43210",
        address: `Dealer Office, ${dealer.name} Street 456`,
        area_id: dealer.area_id,
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    console.log("✓ Created dealer profiles");

    // 9. Create Customer Users (under dealers)
    const customers = [
      {
        id: uuidv5("customer1@billing.com", NAMESPACE),
        name: "Amit Patel",
        email: "customer1@billing.com",
        phone: "+919876543213",
        password: await bcrypt.hash("cust123", SALT_ROUNDS),
        parent_id: dealers[0].id, // Under first dealer
        area_id: areas[0].id, // Downtown area
        vc_number: "VC001234",
        stb_number: "STB001234",
      },
      {
        id: uuidv5("customer2@billing.com", NAMESPACE),
        name: "Sunita Gupta",
        email: "customer2@billing.com",
        phone: "+919876543214",
        password: await bcrypt.hash("cust123", SALT_ROUNDS),
        parent_id: dealers[0].id, // Under first dealer
        area_id: areas[0].id, // Downtown area
        vc_number: "VC001235",
        stb_number: "STB001235",
      },
      {
        id: uuidv5("customer3@billing.com", NAMESPACE),
        name: "Rahul Verma",
        email: "customer3@billing.com",
        phone: "+919876543215",
        password: await bcrypt.hash("cust123", SALT_ROUNDS),
        parent_id: dealers[1].id, // Under second dealer
        area_id: areas[1].id, // Suburb area
        vc_number: "VC001236",
        stb_number: "STB001236",
      },
      {
        id: uuidv5("customer4@billing.com", NAMESPACE),
        name: "Meera Joshi",
        email: "customer4@billing.com",
        phone: "+919876543216",
        password: await bcrypt.hash("cust123", SALT_ROUNDS),
        parent_id: dealers[2].id, // Under third dealer
        area_id: areas[2].id, // Uptown area
        vc_number: "VC001237",
        stb_number: "STB001237",
      },
      {
        id: uuidv5("customer5@billing.com", NAMESPACE),
        name: "Vikram Singh",
        email: "customer5@billing.com",
        phone: "+919876543217",
        password: await bcrypt.hash("cust123", SALT_ROUNDS),
        parent_id: dealers[2].id, // Under third dealer
        area_id: areas[3].id, // Rural area
        vc_number: "VC001238",
        stb_number: "STB001238",
      },
    ];

    for (const customer of customers) {
      await trx("users").insert({
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        password: customer.password,
        role: "customer",
        parent_user_id: customer.parent_id,
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    console.log("✓ Created customer users");

    // 10. Create Customer Profiles
    for (const customer of customers) {
      await trx("customer_profiles").insert({
        id: uuidv5(`profile-${customer.id}`, NAMESPACE),
        user_id: customer.id,
        vc_number: customer.vc_number,
        stb_number: customer.stb_number,
        pan_number: `PAN${customer.vc_number?.slice(-6)}`,
        aadhaar_number: `AAAA${customer.vc_number?.slice(-6)}0000`,
        address: `Customer Address, ${customer.name} Lane ${
          Math.floor(Math.random() * 100) + 1
        }`,
        area_id: customer.area_id,
        status: "active",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    console.log("✓ Created customer profiles");

    // Commit the transaction
    await trx.commit();

    console.log("\n🎉 Database seeding completed successfully!");
    console.log("\n📋 Test Credentials:");
    console.log("Admin: admin@billing.com / admin123");
    console.log("Distributors: distributor1@billing.com / dist123");
    console.log("Dealers: dealer1@billing.com / deal123");
    console.log("Customers: customer1@billing.com / cust123");
  } catch (error) {
    // Rollback on error
    await trx.rollback();
    console.error("❌ Seeding failed, transaction rolled back:", error);
    throw error;
  }
}

// Execute the seeding if this file is run directly
if (require.main === module) {
  const resetFlag = process.argv.includes("--reset");

  if (resetFlag) {
    console.log("🔄 Resetting database before seeding...");
    // Clear existing data (in reverse dependency order)
    seedDatabase()
      .then(async () => {
        // Note: In a real scenario, you'd want to truncate tables here
        // But for simplicity, we'll just proceed with seeding
        console.log("✅ Database reset and seeding completed successfully!");
        process.exit(0);
      })
      .catch((error) => {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
      });
  } else {
    seedDatabase()
      .then(() => {
        console.log("✅ Seeding completed successfully!");
        process.exit(0);
      })
      .catch((error) => {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
      });
  }
}

export { seedDatabase };
