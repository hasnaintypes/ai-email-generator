import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    credit: v.number(),
    clerkId: v.string(),
  }).index("byClerkId", ["clerkId"]),
  emails: defineTable({
    name: v.string(),
    subject: v.string(),
    sender: v.string(),
    recipient: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    userId: v.string(), // clerkId of the user
    elements: v.array(v.any()), // Store the email template elements
    htmlContent: v.optional(v.string()), // Store the HTML version of the email
    isAiGenerated: v.boolean(),
    tone: v.optional(v.string()), // Store the tone of the email
  })
    .index("byUserId", ["userId"])
    .index("byCreatedAt", ["createdAt"]),
});
