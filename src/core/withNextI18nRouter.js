const fs = require("fs");
const path = require("path");

const parseConfigFile = ({ locales, defaultLocale }) => {
  try {
    const __ROUTES__ = {};
    const ROUTES_PATH = path.join("i18n-routes.json");
    const routesJSON = fs.readFileSync(ROUTES_PATH, "utf8");

    const { pages, translations, options } = JSON.parse(routesJSON);

    Object.entries(pages).forEach((entry) => {
      locales.forEach((locale) => {
        const [name, page] = entry;

        let { source, destination, ...restPageOptions } = page;
        const translateKeyRegex = /t\((.*)\)/;

        while (translateKeyRegex.test(source)) {
          const [key, value] = source.match(translateKeyRegex);
          source = source.replace(key, translations[value][locale]);
        }

        __ROUTES__[name] = {
          ...restPageOptions,
          alternates: {
            ...__ROUTES__[name]?.alternates,
            [locale]: {
              source: `/${locale}${source}`,
              destination: `/${locale}${destination}`,
            },
          },
        };
      });
    });

    return {
      routes: __ROUTES__,
      options: {
        ...options,
        defaultLocale: defaultLocale,
      },
    };
  } catch (err) {
    throw new Error(err);
  }
};

const adaptRoutesToNextJS = (routes) => {
  const rewrites = [];

  Object.values(routes).forEach((route) => {
    Object.values(route.alternates).forEach((page) => {
      rewrites.push({
        locale: false,
        source: page.source,
        destination: page.destination,
      });
    });
  });

  return rewrites;
};

const withNextI18nRouter = (nextConfig = {}) => {
  const pluginConfig = parseConfigFile(nextConfig.i18n);

  return Object.assign({}, nextConfig, {
    async rewrites() {
      const i18nrewrites = adaptRoutesToNextJS(pluginConfig.routes);
      const existingRewrites = nextConfig.rewrites
        ? await nextConfig.rewrites()
        : [];

      if (Array.isArray(existingRewrites)) {
        return [...existingRewrites, ...i18nrewrites];
      }

      return {
        ...existingRewrites,
        afterFiles: [...(existingRewrites.afterFiles || []), ...i18nrewrites],
      };
    },
    publicRuntimeConfig: {
      ...nextConfig.publicRuntimeConfig,
      nextI18nRoutes: JSON.stringify(pluginConfig),
    },
  });
};

export default withNextI18nRouter;
