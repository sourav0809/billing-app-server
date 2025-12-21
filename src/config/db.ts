import knex, { Knex } from "knex";
import { Model } from "objection";
import { knexConfig } from "../../knexfile";

export const db: Knex = knex(knexConfig.development);
Model.knex(db);

export const initDb = async () => {
  try {
    console.log("Running database migrations...");
    await db.migrate.latest();
    console.log("Database migrations completed");

    // console.log("Running database seeds...");
    // await db.seed.run();
    // console.log("Database seeds completed");

    console.log("Running database health check...");
    await db.raw("SELECT 1");
    console.log("Database health check passed");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
};
