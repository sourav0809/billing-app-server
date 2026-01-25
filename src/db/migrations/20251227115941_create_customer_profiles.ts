import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("customer_profiles", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table
      .uuid("user_id")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("vc_number");
    table.string("stb_number");
    table.string("pan_number");
    table.string("aadhaar_number");
    table.string("address");
    table
      .uuid("area_id")
      .nullable()
      .references("id")
      .inTable("areas")
      .onDelete("SET NULL");
    table.enum("status", ["active", "archived"]).defaultTo("active");
    table.timestamps(true, true);
    table.timestamp("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("customer_profiles");
}
