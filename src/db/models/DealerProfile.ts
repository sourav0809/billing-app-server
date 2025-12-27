import { Model } from "objection";
import { User } from "./User";
import { Area } from "./Area";

export class DealerProfile extends Model {
  id!: string;
  user_id!: string;
  emergency_contact?: string;
  address?: string;
  area_id?: string;
  status!: "active" | "archived";
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date;

  user?: User;
  area?: Area;

  static tableName = "dealer_profiles";

  static jsonSchema = {
    type: "object",
    properties: {
      id: { type: "string" },
      user_id: { type: "string" },
      emergency_contact: { type: "string" },
      address: { type: "string" },
      area_id: { type: ["string", "null"] },
      status: { type: "string", enum: ["active", "archived"] },
      deleted_at: { type: ["string", "null"], format: "date-time" },
    },
  };

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "dealer_profiles.user_id",
        to: "users.id",
      },
    },
    area: {
      relation: Model.BelongsToOneRelation,
      modelClass: Area,
      join: {
        from: "dealer_profiles.area_id",
        to: "areas.id",
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
