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

            let { url } = page;
            const translateKeyRegex = /t\((.*)\)/;

            while (translateKeyRegex.test(url)) {
              const [key, value] = url.match(translateKeyRegex);
              url = url.replace(key, translations[value][locale]);
            }

            __ROUTES__.push({
              source: `/${locale}${url}`,
              destination: `/${locale}${page.pathname}`,
              locale: false,
            });
            __ROUTES_WITH_PROPERTIES__[name] = { ...page };
          });
        });

        process.env.NEXT_PUBLIC_I18N_ROUTES = JSON.stringify(
          __ROUTES_WITH_PROPERTIES__
        );
      } catch (err) {
        throw new Error(err);
      }

      // todo: custom one should be included here
      return [...__ROUTES__];
    },
  });
};
