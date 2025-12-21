import { Model } from "objection";

export class User extends Model {
  id!: string;
  password!: string;
  email!: string;
  static tableName = "users";

  static jsonSchema = {
    type: "object",
    properties: {
      id: { type: "string" },
      password: { type: "string" },
      email: { type: "string" },
    },
  };

  $formatJson(json: any) {
    json = super.$formatJson(json);
    delete json.password;
    return json;
  }

  public static async createUser(user: Partial<User>): Promise<User> {
    return await User.query().insert(user).returning("*");
  }

  public static async getUserById(id: string): Promise<User> {
    return await User.query().findById(id).first().throwIfNotFound();
  }

  public static async getUserByEmail(email: string): Promise<User | undefined> {
    return await User.query().where("email", email).first();
  }
}
