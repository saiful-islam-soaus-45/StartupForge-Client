// path: lib/auth.js
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        input: true,
      },
      plan: {
        type: "string",
        required: true,
        defaultValue: "free",
        input: false,
      },

      status: {
        type: "string",
        defaultValue: "active",
        input: false,
      },
    },
  },
  hooks: {
  before: async (ctx) => {

    if (ctx.path.includes("/sign-in")) {

      const email = ctx.body?.email;

      const user = await db
        .collection("user")
        .findOne({ email });

      if (user?.status === "blocked") {
        throw new Error(
          "Your account has been blocked."
        );
      }

    }

    return ctx;
  },
},
});
