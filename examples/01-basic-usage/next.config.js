const withNextI18nRouter = require("nextjs-i18n-router/config");

module.exports = withNextI18nRouter({
  i18n: {
    locales: ["tr", "en", "de"],
    defaultLocale: "tr",
    localeDetection: false,
  },
  reactStrictMode: true,
  rewrites: async function rewrites() {
    return [
      {
        source: "/murat",
        destination: "/",
      },
    ];
  },
});
