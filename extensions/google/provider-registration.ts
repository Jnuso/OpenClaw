import type { OpenClawPluginApi } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth-api-key";
import { buildProviderReplayFamilyHooks } from "openclaw/plugin-sdk/provider-model-shared";
import { buildProviderStreamFamilyHooks } from "openclaw/plugin-sdk/provider-stream-family";
import {
  GOOGLE_GEMINI_DEFAULT_MODEL,
  applyGoogleGeminiModelDefault,
  normalizeGoogleProviderConfig,
  normalizeGoogleModelId,
  resolveGoogleGenerativeAiTransport,
} from "./api.js";
import { isModernGoogleModel, resolveGoogleGeminiForwardCompatModel } from "./provider-models.js";

const GOOGLE_GEMINI_PROVIDER_HOOKS = {
  ...buildProviderReplayFamilyHooks({
    family: "google-gemini",
  }),
  ...buildProviderStreamFamilyHooks("google-thinking"),
};

const GOOGLE_GEMMA_MODEL_CATALOG = [
  {
    provider: "google",
    id: "gemma-3-1b-it",
    name: "Gemma 3 1B Instruct",
    contextWindow: 32_000,
    input: ["text"],
    compat: {
      supportsTools: false,
    },
  },
  {
    provider: "google",
    id: "gemma-3-4b-it",
    name: "Gemma 3 4B Instruct",
    contextWindow: 128_000,
    input: ["text", "image"],
    compat: {
      supportsTools: false,
    },
  },
  {
    provider: "google",
    id: "gemma-3-12b-it",
    name: "Gemma 3 12B Instruct",
    contextWindow: 128_000,
    input: ["text", "image"],
    compat: {
      supportsTools: false,
    },
  },
  {
    provider: "google",
    id: "gemma-3-27b-it",
    name: "Gemma 3 27B Instruct",
    contextWindow: 128_000,
    input: ["text", "image"],
    compat: {
      supportsTools: false,
    },
  },
  {
    provider: "google",
    id: "gemma-3n-e4b-it",
    name: "Gemma 3n E4B Instruct",
    contextWindow: 32_000,
    input: ["text", "image"],
    compat: {
      supportsTools: false,
    },
  },
] as const;

export function registerGoogleProvider(api: OpenClawPluginApi) {
  api.registerProvider({
    id: "google",
    label: "Google AI Studio",
    docsPath: "/providers/models",
    hookAliases: ["google-antigravity", "google-vertex"],
    envVars: ["GEMINI_API_KEY", "GOOGLE_API_KEY"],
    auth: [
      createProviderApiKeyAuthMethod({
        providerId: "google",
        methodId: "api-key",
        label: "Google Gemini/Gemma API key",
        hint: "AI Studio API key for Gemini and hosted Gemma models",
        optionKey: "geminiApiKey",
        flagName: "--gemini-api-key",
        envVar: "GEMINI_API_KEY",
        promptMessage: "Enter Gemini/Gemma API key",
        defaultModel: GOOGLE_GEMINI_DEFAULT_MODEL,
        expectedProviders: ["google"],
        applyConfig: (cfg) => applyGoogleGeminiModelDefault(cfg).next,
        wizard: {
          choiceId: "gemini-api-key",
          choiceLabel: "Google Gemini/Gemma API key",
          groupId: "google",
          groupLabel: "Google",
          groupHint: "Gemini and hosted Gemma API key + OAuth",
        },
      }),
    ],
    augmentModelCatalog: () => [...GOOGLE_GEMMA_MODEL_CATALOG],
    normalizeTransport: ({ api, baseUrl }) => resolveGoogleGenerativeAiTransport({ api, baseUrl }),
    normalizeConfig: ({ provider, providerConfig }) =>
      normalizeGoogleProviderConfig(provider, providerConfig),
    normalizeModelId: ({ modelId }) => normalizeGoogleModelId(modelId),
    resolveDynamicModel: (ctx) =>
      resolveGoogleGeminiForwardCompatModel({
        providerId: ctx.provider,
        ctx,
      }),
    ...GOOGLE_GEMINI_PROVIDER_HOOKS,
    isModernModelRef: ({ modelId }) => isModernGoogleModel(modelId),
  });
}
