import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { generateHtmlFromElements } from "../lib/html-generator";

// Create a new email template
export const createEmail = mutation({
  args: {
    name: v.string(),
    subject: v.string(),
    sender: v.string(),
    recipient: v.optional(v.string()),
    elements: v.array(v.any()),
    htmlContent: v.optional(v.string()),
    userId: v.string(),
    isAiGenerated: v.boolean(),
    tone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();

    // If no HTML content is provided but we have elements, generate HTML
    let htmlContent = args.htmlContent;
    if (!htmlContent && args.elements && args.elements.length > 0) {
      htmlContent = generateHtmlFromElements(args.elements);
    }

    const emailId = await ctx.db.insert("emails", {
      name: args.name,
      subject: args.subject,
      sender: args.sender,
      recipient: args.recipient || "",
      elements: args.elements,
      htmlContent: htmlContent || "",
      userId: args.userId,
      createdAt: timestamp,
      updatedAt: timestamp,
      isAiGenerated: args.isAiGenerated,
      tone: args.tone || "professional",
    });

    console.log(`Email created with ID: ${emailId}`);
    return emailId;
  },
});

// Get all emails for a user
export const getUserEmails = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const emails = await ctx.db
      .query("emails")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    console.log(`Retrieved ${emails.length} emails for user ${args.userId}`);
    return emails;
  },
});

// Get a single email by ID
export const getEmailById = query({
  args: { id: v.id("emails") },
  handler: async (ctx, args) => {
    const email = await ctx.db.get(args.id);
    return email;
  },
});

// Update an existing email
export const updateEmail = mutation({
  args: {
    id: v.id("emails"),
    name: v.optional(v.string()),
    subject: v.optional(v.string()),
    sender: v.optional(v.string()),
    recipient: v.optional(v.string()),
    elements: v.optional(v.array(v.any())),
    htmlContent: v.optional(v.string()),
    tone: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    // Only include fields that are provided
    const fieldsToUpdate = Object.entries(updates)
      .filter(([_, value]) => value !== undefined)
      .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    // If elements are updated but no HTML content is provided, generate HTML
    if (fieldsToUpdate.elements && !fieldsToUpdate.htmlContent) {
      fieldsToUpdate.htmlContent = generateHtmlFromElements(
        fieldsToUpdate.elements
      );
    }

    // Add updatedAt timestamp
    fieldsToUpdate.updatedAt = Date.now();

    await ctx.db.patch(id, fieldsToUpdate);
    console.log(`Email ${id} updated successfully`);

    return id;
  },
});

// Delete an email
export const deleteEmail = mutation({
  args: { id: v.id("emails") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    console.log(`Email ${args.id} deleted successfully`);
    return args.id;
  },
});
