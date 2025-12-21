import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("email").unique().notNullable();
    table.string("password").notNullable();
    table.string("phone_number");
    table.string("name");

    table
      .enum("role", ["distributor", "dealer", "customer"])
      .defaultTo("customer");

    table
      .uuid("parent_id")
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
