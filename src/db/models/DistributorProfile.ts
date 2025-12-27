import { Model } from "objection";
import { User } from "./User";

export class DistributorProfile extends Model {
  id!: string;
  user_id!: string;
  emergency_contact?: string;
  address?: string;
  status!: "active" | "archived";
  created_at!: Date;
  updated_at!: Date;
  deleted_at?: Date;

  user?: User;

  static tableName = "distributor_profiles";

  static jsonSchema = {
    type: "object",
    properties: {
      id: { type: "string" },
      user_id: { type: "string" },
      emergency_contact: { type: "string" },
      address: { type: "string" },
      status: { type: "string", enum: ["active", "archived"] },
      deleted_at: { type: ["string", "null"], format: "date-time" },
    },
  };

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "distributor_profiles.user_id",
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
