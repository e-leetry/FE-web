import nextConfig from "eslint-config-next";

const config = [
  {
    ignores: ["node_modules", ".next", "dist"]
  },
  ...nextConfig,
  {
    files: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          name: "zustand",
          message: "Import Zustand stores via the store modules to keep UI state scoped."
        }
      ]
    }
  }
];

export default config;
