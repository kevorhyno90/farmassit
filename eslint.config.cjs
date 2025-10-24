// Minimal flat config compatible with ESLint v9 that mirrors the existing
// .eslintrc.json extends. Export as an array per the flat config format.
module.exports = [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
    },
    extends: ["next/core-web-vitals", "next/typescript"],
    rules: {},
  },
];
