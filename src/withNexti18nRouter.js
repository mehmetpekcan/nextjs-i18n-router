const fs = require("fs");
const path = require("path");

module.exports = (nextConfig = {}) => {
  return Object.assign({}, nextConfig, {
    /**
       w* This should be always `true` because of some bugy working of
       * rewrites `source`, `destination` when setting this flat to `false`
       */
    useFileSystemPublicRoutes: true,
    async rewrites() {
      const __ROUTES__ = [];
      const __ROUTES_WITH_PROPERTIES__ = {};
      const ROUTES_PATH = path.join("i18n-routes.json");

      /**
       * We need this to prevent file system routing.
       * Point all routes to 404 except the ones created in createRoutes method
       * Also 'useFileSystemPublicRoutes' passing false creates another problem
       * when using dynamic routes rewriting.
       */
      try {
        const routesJSON = fs.readFileSync(ROUTES_PATH, "utf8");
        const { pages, translations } = JSON.parse(routesJSON);

        Object.entries(pages).forEach((entry) => {
          nextConfig.i18n.locales.forEach((locale) => {
            const [name, page] = entry;

            let { source } = page;
            const translateKeyRegex = /t\((.*)\)/;

            while (translateKeyRegex.test(source)) {
              const [key, value] = source.match(translateKeyRegex);
              source = source.replace(key, translations[value][locale]);
            }

            __ROUTES__.push({
              source: `/${locale}${source}`,
              destination: `/${locale}${page.destination}`,
              locale: false,
            });
            __ROUTES_WITH_PROPERTIES__[`${locale}_${name}`] = {
              ...page,
              source: `/${locale}${source}`,
              destination: `/${locale}${page.destination}`,
            };
          });
        });

        // TODO: make __ROUTES_WITH_PROPERTIES__ and __ROUTES__ as one
        process.env.NEXT_PUBLIC_I18N_ROUTES = JSON.stringify(
          __ROUTES_WITH_PROPERTIES__
        );

        console.log(process.env.NEXT_PUBLIC_I18N_ROUTES);
      } catch (err) {
        throw new Error(err);
      }

      // todo: custom one should be included here
      return [
        ...(nextConfig.rewrites && (await nextConfig.rewrites())),
        ...__ROUTES__,
      ];
    },
  });
};
