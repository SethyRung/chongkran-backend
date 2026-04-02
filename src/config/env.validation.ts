import { z } from "zod";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().min(1).default("8080"),

    API_CURRENT_VERSION: z.string().min(1).default("1.1"),
    API_DESCRIPTION: z.string().min(1).default("Nest JS & MongoDB"),
    API_NAME: z.string().min(1).default("Chongkran API"),
    API_ROOT: z.string().min(1).default("api/docs"),
    SITE_TITLE: z.string().min(1).default("Chongkran"),

    DATABASE_URL: z.string().min(1),

    ACCESS_TOKEN_SECRET: z.string().min(1),
    ACCESS_TOKEN_EXPIRATION: z.string().min(1),
    REFRESH_TOKEN_SECRET: z.string().min(1),
    REFRESH_TOKEN_EXPIRATION: z.string().min(1),

    ALLOW_ORIGIN: z.string().min(1),

    CLOUDINARY_CLOUD_NAME: z.string().min(1),
    CLOUDINARY_API_KEY: z.string().min(1),
    CLOUDINARY_API_SECRET: z.string().min(1),
  })
  .readonly();

export type Env = z.infer<typeof envSchema>;

export function validateEnv(config: Record<string, unknown>): Env {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    console.error("Invalid environment variables:", z.treeifyError(result.error));
    throw new Error("Invalid environment variables");
  }

  return result.data;
}
