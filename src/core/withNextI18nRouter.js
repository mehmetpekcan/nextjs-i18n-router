const fs = require("fs");
const path = require("path");

/**
 * Formats `pathname` to `destination` by requirement of rewrites
 */
const formatPathnameToDestination = (pathname) => {
  return pathname
    .replace(/\[\[\.\.\.(.*?)\]\]/g, ":$1*") // Matches [[...slug]]
    .replace(/\[\.\.\.(.*?)\]/g, ":$1*") // Matches [...slug]
    .replace(/\[(.*?)\]/g, ":$1"); // Matches [slug]
};

/**
 * Creates a bunch of 404 destinated routes list
 * with the given pages
 */
const create404Routes = (pages) =>
  pages.flatMap((page) => {
    let source = `/${page.replace(".js", "")}`;
    let destination = "/404";

    if (source === "/index") {
      return { source: "/", destination };
    }

    return [
      { source, destination },
      { source: `${source}/(.*)`, destination },
    ];
  });

/**
 * Returns the file names list on native NextJS pages folder
 */
const getPagesDirectoryRoutes = () => {
  const RESERVED_PAGES = [
    "_app.js",
    "_document.js",
    "_error.js",
    "404.js",
    "500.js",
    "api",
  ];
  const PAGES_PATHS = ["pages", "src/pages"];
  const pagesDirectory = PAGES_PATHS.find((dir) =>
    fs.existsSync(path.join(process.cwd(), dir))
  );

  if (!pagesDirectory) {
    throw new Error(
      "No pages folder defined, please create your pages folder under `pages` or `src/pages` directory"
    );
  }

  return fs
    .readdirSync(path.join(process.cwd(), pagesDirectory))
    .filter((page) => !RESERVED_PAGES.includes(page));
};

/**
 * Parses the plugin config file and creates the routes
 * according to given config manifest
 */
const parseConfigFile = ({ locales, defaultLocale }) => {
  try {
    const routes = { afterFiles: {}, beforeFiles: [] };
    const configPath = path.join("i18n-routes.json");
    const routesJSON = fs.readFileSync(configPath, "utf8");
    const { pages, translations, options } = JSON.parse(routesJSON);

    Object.entries(pages).forEach((entry) => {
      locales.forEach((locale) => {
        let [name, { source, pathname, meta }] = entry;
        const translateKeyRegex = /t\((.*)\)/;

        while (translateKeyRegex.test(source)) {
          const [key, value] = source.match(translateKeyRegex);
          source = source.replace(key, translations[value][locale]);
        }

        routes.afterFiles[name] = {
          pathname,
          meta,
          alternates: {
            ...routes.afterFiles[name]?.alternates,
            [locale]: {
              source: `/${locale}${source}`,
              destination: `/${locale}${formatPathnameToDestination(pathname)}`,
            },
          },
        };
      });
    });

    if (options.closeFileSystemRouting) {
      const pagesDirectoryRoutes = getPagesDirectoryRoutes();
      routes.beforeFiles = create404Routes(pagesDirectoryRoutes);
    }

    return { routes, options: { ...options, defaultLocale: defaultLocale } };
  } catch (err) {
    throw new Error(err);
  }
};

/**
 * Adapts the given routes to the NextJS rewrites config formats
 */
const adaptRoutesToNextJS = (routes) => {
  const rewrites = [];

  Object.values(routes).forEach((route) => {
    Object.values(route.alternates).forEach(({ source, destination }) => {
      rewrites.push({ locale: false, source, destination });
    });
  });

  return rewrites;
};

const withNextI18nRouter = (nextConfig = {}) => {
  const config = parseConfigFile(nextConfig.i18n);

  return Object.assign({}, nextConfig, {
    async rewrites() {
      const i18nRewrites = adaptRoutesToNextJS(config.routes.afterFiles);
      const existingRewrites = nextConfig.rewrites
        ? await nextConfig.rewrites()
        : [];

      if (Array.isArray(existingRewrites)) {
        return {
          beforeFiles: [...config.routes.beforeFiles],
          afterFiles: [...existingRewrites, ...i18nRewrites],
        };
      }

      return {
        ...existingRewrites,
        beforeFiles: [
          ...beforeFiles(existingRewrites.beforeFiles || []),
          ...config.routes.beforeFiles,
        ],
        afterFiles: [...(existingRewrites.afterFiles || []), ...i18nRewrites],
      };
    },
    publicRuntimeConfig: {
      ...nextConfig.publicRuntimeConfig,
      nextI18nRoutes: JSON.stringify({
        ...config,
        routes: config.routes.afterFiles,
      }),
    },
  });
};

export default withNextI18nRouter;
