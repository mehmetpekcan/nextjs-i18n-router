const withNextI18nRouter = require("nextjs-i18n-router/withNexti18nRouter");

module.exports = withNextI18nRouter({
  i18n: {
    locales: ["tr", "en", "de"],
    defaultLocale: "tr",
    localeDetection: false,
  },
  reactStrictMode: true,
});
