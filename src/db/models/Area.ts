import { Model } from "objection";
import { User } from "./User";

export class Area extends Model {
  id!: string;
  user_id?: string;
  name!: string;
  pincode!: string;
  status!: "active" | "archived";
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date;

  user?: User;

  static tableName = "areas";

  static jsonSchema = {
    type: "object",
    properties: {
      id: { type: "string" },
      user_id: { type: ["string", "null"] },
      name: { type: "string" },
      pincode: { type: "string" },
      status: { type: "string", enum: ["active", "archived"] },
      deleted_at: { type: ["string", "null"], format: "date-time" },
    },
    required: ["name", "pincode"],
  };

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "areas.user_id",
        to: "users.id",
      },
    },
  };

  async $beforeUpdate() {
    (this as any).updated_at = new Date();
  }

  $formatJson(json: any) {
    json = super.$formatJson(json);
    return json;
  }

  // -----------------------------
  // Query helpers
  // -----------------------------

  /**
   * Create an area.
   * @param data - The data to create the area with.
   * @param trx - Optional transaction object.
   * @returns The created area.
   */
  static async createArea(data: Partial<Area>, trx?: any) {
    const query = this.query();
    if (trx) {
      query.transacting(trx);
    }
    return query.insert(data).returning("*");
  }

  /**
   * Get all areas (excluding deleted ones).
   * @returns All active areas.
   */
  static async getAreas() {
    return this.query()
      .whereNull("deleted_at")
      .withGraphFetched("user")
      .orderBy("created_at", "desc");
  }
}
