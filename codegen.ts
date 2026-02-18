import type { CodegenConfig } from "@graphql-codegen/cli";
import { addTypenameSelectionDocumentTransform } from "@graphql-codegen/client-preset";
import "dotenv/config";

const supabaseProjectUri = process.env.EXPO_PUBLIC_SUPABASE_PROJECT_URI;
const supabaseApiKey = process.env.EXPO_PUBLIC_API_KEY;

if (!supabaseProjectUri) {
  throw new Error("SUPABASE_PROJECT_URI is not defined");
}

if (!supabaseApiKey) {
  throw new Error("API_KEY is not defined");
}

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      [supabaseProjectUri]: {
        headers: {
          apikey: supabaseApiKey,
        },
      },
    },
  ],
  documents: "**/*.tsx",
  overwrite: true,
  ignoreNoDocuments: true,
  generates: {
    "gql/": {
      preset: "client",
      documentTransforms: [addTypenameSelectionDocumentTransform],
      plugins: [],
      config: {
        scalars: {
          UUID: "string",
          Date: "string",
          Time: "string",
          Datetime: "string",
          JSON: "string",
          BigInt: "string",
          BigFloat: "string",
          Opaque: "any",
        },
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["npm run prettier"], // optional
  },
};
export default config;
