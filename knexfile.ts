import type { Knex } from "knex";
import { knexSnakeCaseMappers } from "objection";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      tableName: "knex_migrations",
      directory: "./src/db/migrations",
      extension: "ts",
    },
    seeds: {
      directory: "./src/db/seeds",
      extension: "ts",
    },
    ...knexSnakeCaseMappers(),
  },
};

export default knexConfig;
