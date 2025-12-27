import { Model } from "objection";
import { User } from "./User";
import { Area } from "./Area";

export class CustomerProfile extends Model {
  id!: string;
  user_id!: string;
  vc_number?: string;
  stb_number?: string;
  pan_number?: string;
  aadhaar_number?: string;
  address?: string;
  area_id?: string;
  status!: "active" | "archived";
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date;

  user?: User;
  area?: Area;

  static tableName = "customer_profiles";

  static jsonSchema = {
    type: "object",
    properties: {
      id: { type: "string" },
      user_id: { type: "string" },
      vc_number: { type: "string" },
      stb_number: { type: "string" },
      pan_number: { type: "string" },
      aadhaar_number: { type: "string" },
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
        from: "customer_profiles.user_id",
        to: "users.id",
      },
    },
    area: {
      relation: Model.BelongsToOneRelation,
      modelClass: Area,
      join: {
        from: "customer_profiles.area_id",
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
