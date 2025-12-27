import { Model } from "objection";
import { CustomerProfile } from "./CustomerProfile";
import { DealerProfile } from "./DealerProfile";
import { DistributorProfile } from "./DistributorProfile";

export class User extends Model {
  id!: string;
  name?: string;
  email!: string;
  phone?: string;
  password!: string;
  role!: "admin" | "distributor" | "dealer" | "customer";
  parent_user_id?: string | null;
  status!: "active" | "inactive" | "archived";
  deleted_at?: Date | null;
  customer_profile?: CustomerProfile;
  dealer_profile?: DealerProfile;
  distributor_profile?: DistributorProfile;
  parent_user?: User;
  children?: User[];

  static tableName = "users";

  static jsonSchema = {
    type: "object",
    required: ["email", "password", "role"],
    properties: {
      id: { type: "string", format: "uuid" },
      name: { type: "string" },
      email: { type: "string", format: "email" },
      phone: { type: "string" },
      password: { type: "string" },

      role: {
        type: "string",
        enum: ["admin", "distributor", "dealer", "customer"],
      },

      parent_user_id: { type: ["string", "null"], format: "uuid" },

      status: {
        type: "string",
        enum: ["active", "inactive", "archived"],
      },

      deleted_at: { type: ["string", "null"], format: "date-time" },
    },
  };

  static relationMappings = {
    customer_profile: {
      relation: Model.HasOneRelation,
      modelClass: CustomerProfile,
      join: {
        from: "users.id",
        to: "customer_profiles.user_id",
      },
    },

    dealer_profile: {
      relation: Model.HasOneRelation,
      modelClass: DealerProfile,
      join: {
        from: "users.id",
        to: "dealer_profiles.user_id",
      },
    },

    distributor_profile: {
      relation: Model.HasOneRelation,
      modelClass: DistributorProfile,
      join: {
        from: "users.id",
        to: "distributor_profiles.user_id",
      },
    },

    parent_user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "users.parent_user_id",
        to: "users.id",
      },
    },

    children: {
      relation: Model.HasManyRelation,
      modelClass: User,
      join: {
        from: "users.id",
        to: "users.parent_user_id",
      },
    },
  };

  async $beforeUpdate() {
    (this as any).updated_at = new Date();
  }

  // hide password in responses
  $formatJson(json: any) {
    json = super.$formatJson(json);
    delete json.password;
    return json;
  }

  // -----------------------------
  // Query helpers
  // -----------------------------

  static async createUser(data: Partial<User>) {
    return this.query().insert(data).returning("*");
  }

  static async getUserById(id: string) {
    return this.query().findById(id).whereNull("deleted_at").throwIfNotFound();
  }

  static async getUserByEmail(email: string) {
    return this.query().where("email", email).whereNull("deleted_at").first();
  }
}
