import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_code", (q) => q.eq("code", args.code.toLowerCase()))
      .first();
    return profile;
  },
});

export const save = mutation({
  args: { code: v.string(), records: v.string() },
  handler: async (ctx, args) => {
    const code = args.code.toLowerCase();
    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_code", (q) => q.eq("code", code))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { records: args.records });
    } else {
      await ctx.db.insert("profiles", { code, records: args.records });
    }
  },
});
