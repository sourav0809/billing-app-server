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
}
