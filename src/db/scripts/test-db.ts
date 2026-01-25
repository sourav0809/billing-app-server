import dotenv from "dotenv";
import { db } from "@/config/db";

// Load environment variables
dotenv.config();

async function testDatabaseConnection(): Promise<void> {
  try {
    console.log("Testing database connection...");
    await db.raw("SELECT 1");
    console.log("✅ Database connection successful");

    // Check if tables exist
    const tables = await db.raw(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

    console.log("📋 Existing tables:");
    tables.rows.forEach((row: any) => {
      console.log(`  - ${row.table_name}`);
    });

  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

// Execute the test if this file is run directly
if (require.main === module) {
  testDatabaseConnection()
    .then(() => {
      console.log("✅ Database test completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Database test failed:", error);
      process.exit(1);
    });
}

export { testDatabaseConnection };
