const fs = require("fs");
const path = require("path");

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    async rewrites() {
      const __ROUTES__ = {};
      const ROUTES_PATH = path.join("i18n-routes.json");

      try {
        const routesJSON = fs.readFileSync(ROUTES_PATH, "utf8");
        const { pages, translations, options } = JSON.parse(routesJSON);

        Object.entries(pages).forEach((entry) => {
          nextConfig.i18n.locales.forEach((locale) => {
            const [name, page] = entry;

            let { source } = page;
            const translateKeyRegex = /t\((.*)\)/;

            while (translateKeyRegex.test(source)) {
              const [key, value] = source.match(translateKeyRegex);
              source = source.replace(key, translations[value][locale]);
            }

            __ROUTES__[`${locale}_${name}`] = {
              ...page,
              source: `/${locale}${source}`,
              destination: `/${locale}${page.destination}`,
            };
          });
        });

        process.env.NEXT_PUBLIC_I18N_ROUTES = JSON.stringify(__ROUTES__);
        process.env.NEXT_PUBLIC_ROUTER_OPTIONS = JSON.stringify({
          ...options,
          defaultLocale: nextConfig.i18n.defaultLocale,
        });
      } catch (err) {
        throw new Error(err);
      }

      return [
        ...(nextConfig.rewrites && (await nextConfig.rewrites())),
        ...Object.values(__ROUTES__).map(({ source, destination }) => ({
          source,
          destination,
          locale: false,
        })),
      ];
    },
  });
};
