import z from "zod";

const configSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT: z.string(),
});

const configObject = configSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
});

if (!configObject.success) {
    console.error("Invalid environment variables:", configObject.error.format());
    throw new Error("Invalid environment variables");
}

const envConfig = configObject.data;
export default envConfig;