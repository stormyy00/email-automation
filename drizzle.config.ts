import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/utils/database.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_POSTGRES_URL!,
  },
});
