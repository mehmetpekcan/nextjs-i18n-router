const fs = require("fs");
const path = require("path");

const parseConfigFile = ({ locales, defaultLocale }) => {
  try {
    const configPath = path.join("i18n-routes.json");

    const routesJSON = fs.readFileSync(configPath, "utf8");

    const routesTree = {};
    const { pages, translations, options } = JSON.parse(routesJSON);

    Object.entries(pages).forEach((entry) => {
      locales.forEach((locale) => {
        let [name, { source, destination, ...restPageOptions }] = entry;
        const translateKeyRegex = /t\((.*)\)/;

        while (translateKeyRegex.test(source)) {
          const [key, value] = source.match(translateKeyRegex);
          source = source.replace(key, translations[value][locale]);
        }

        routesTree[name] = {
          ...restPageOptions,
          alternates: {
            ...routesTree[name]?.alternates,
            [locale]: {
              source: `/${locale}${source}`,
              destination: `/${locale}${destination}`,
            },
          },
        };
      });
    });

    return {
      routes: routesTree,
      options: { ...options, defaultLocale: defaultLocale },
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
  const config = parseConfigFile(nextConfig.i18n);

  return Object.assign({}, nextConfig, {
    async rewrites() {
      const i18nRewrites = adaptRoutesToNextJS(config.routes);
      const existingRewrites = nextConfig.rewrites
        ? await nextConfig.rewrites()
        : [];

      if (Array.isArray(existingRewrites)) {
        return [...existingRewrites, ...i18nRewrites];
      }

      return {
        ...existingRewrites,
        afterFiles: [...(existingRewrites.afterFiles || []), ...i18nRewrites],
      };
    },
    publicRuntimeConfig: {
      ...nextConfig.publicRuntimeConfig,
      nextI18nRoutes: JSON.stringify(config),
    },
  });
};

export default withNextI18nRouter;
