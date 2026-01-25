import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());

    table.string("name");
    table.string("email").notNullable().unique();
    table.string("phone").notNullable().unique();
    table.string("password").notNullable();

    table
      .enu("role", ["admin", "distributor", "dealer", "customer"], {
        useNative: true,
        enumName: "user_role_enum",
      })
      .notNullable()
      .defaultTo("customer");

    table
      .uuid("parent_user_id")
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");

    table
      .enu("status", ["active", "inactive", "archived"], {
        useNative: true,
        enumName: "user_status_enum",
      })
      .notNullable()
      .defaultTo("active");

    table.timestamps(true, true);

    table.timestamp("deleted_at").nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
