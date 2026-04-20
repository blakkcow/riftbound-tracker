import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    code: v.string(),
    records: v.string(),
  }).index("by_code", ["code"]),
});
