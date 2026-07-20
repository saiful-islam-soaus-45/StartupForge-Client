// path: lib/auth.js (অথবা আপনার যেখানে Better-Auth কনফিগার করা)
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
        required: true,      // রোল ম্যান্ডেটরি করা হলো
        input: true,         // ⚡ ফ্রন্টএন্ড থেকে ইনপুট নেওয়ার অনুমতি দেওয়া হলো
      },
    },
  },
});