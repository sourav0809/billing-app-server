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

  /**
   * Create a user.
   * @param data - The data to create the user with.
   * @param trx - Optional transaction object.
   * @returns The created user.
   */
  static async createUser(data: Partial<User>, trx?: any) {
    const query = this.query();
    if (trx) {
      query.transacting(trx);
    }
    return query.insert(data).returning("*");
  }

  /**
   * Get a user by their ID.
   * @param id - The ID of the user to get.
   * @returns The user with their associated profile (customer, dealer, or distributor).
   */
  static async getUserById(id: string) {
    return this.query()
      .findById(id)
      .whereNull("deleted_at")
      .withGraphFetched(
        "[customer_profile, dealer_profile, distributor_profile]"
      )
      .throwIfNotFound();
  }

  /**
   * Get a user by their email.
   * @param email - The email of the user to get.
   * @returns The user.
   */
  static async getUserByEmail(email: string) {
    return this.query()
      .where("email", email)
      .whereNull("deleted_at")
      .withGraphFetched(
        "[customer_profile, dealer_profile, distributor_profile]"
      )
      .first();
  }

  /**
   * Get paginated customers with their profiles.
   * @param options - Pagination and filter options.
   * @param options.page - Page number (default: 1).
   * @param options.limit - Items per page (default: 10).
   * @param options.parent_user_id - Optional parent user ID to filter by.
   * @param options.name - Optional name filter (case-insensitive partial match).
   * @returns Paginated customers with metadata.
   */
  static async getCustomers(options: {
    page?: number;
    limit?: number;
    parent_user_id?: string | null;
    name?: string;
  }) {
    const { page = 1, limit = 10, parent_user_id, name } = options;

    const query = this.query()
      .where("role", "customer")
      .whereNull("deleted_at")
      .modify((q) => {
        if (parent_user_id !== undefined) {
          q.where("parent_user_id", parent_user_id);
        }

        if (name) {
          q.whereILike("name", `%${name}%`);
        }
      })
      .withGraphFetched("customer_profile.area")
      .orderBy("created_at", "desc");

    const result = await query.page(page - 1, limit);

    return {
      data: result.results,
      pagination: {
        page,
        limit,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        hasNextPage: page * limit < result.total,
        hasPreviousPage: page > 1,
      },
    };
  }
}
