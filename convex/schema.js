import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    credit: v.number(),
    clerkId: v.string(),
  }).index("byClerkId", ["clerkId"]),
});
