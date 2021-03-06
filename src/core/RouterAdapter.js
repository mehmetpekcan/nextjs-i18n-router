let pluginConfig = null;
const isServer = () => typeof window === "undefined";

const getLocale = (locale = null) => {
  if (locale) return locale;

  const { locale: routerLocale } = require("next/router").default.router;

  return routerLocale;
};

const getPluginConfig = () => {
  if (!pluginConfig) {
    const getConfig = require("next/config").default;
    const { publicRuntimeConfig } = getConfig();
    pluginConfig = JSON.parse(publicRuntimeConfig.nextI18nRoutes);
  }

  return pluginConfig;
};

/**
 * Find the route by provided `pathname`
 */
const getRoute = (pathname, asPath, locale) => {
  const { routes } = getPluginConfig();

  const routeCandidates = Object.values(routes).filter(
    (route) => route.pathname === pathname
  );

  if (routeCandidates.length === 1) {
    return routeCandidates[0];
  } else if (routeCandidates.length > 1) {
    const { match } = require("path-to-regexp");

    return routeCandidates.find((candidate) => {
      const sourceMatcher = match(candidate.alternates[locale].source);

      return sourceMatcher(`/${locale}${asPath}`);
    });
  } else {
    throw new Error(
      `Route couldn't find by provided pathname: ${pathname} and asPath: ${asPath}`
    );
  }
};

/**
 * Get active route by provided `pathname` yet if `pathname`
 * won't be provided, get the pathname from `router`
 */
const getActiveRoute = (pathname) => {
  if (isServer() && !pathname) {
    throw new Error("Please provide pathname on Server Side");
  }

  const { pathname: path, asPath } = require("next/router").default.router;
  const locale = getLocale();
  const activeRoute = getRoute(pathname || path, asPath, locale);

  return { ...activeRoute, ...activeRoute.alternates[locale] };
};

/**
 * Create url according to given `name`, `locale` and `params`
 * `name` arg should be findable inside i18n-routes.json file
 */
const createUrl = (name, localeArg, params) => {
  try {
    const locale = getLocale(localeArg);
    const { routes, options } = getPluginConfig();
    const { source } = routes[name].alternates[locale];

    let finalSource =
      locale === options.defaultLocale && options.hideDefaultLocalePrefix
        ? `${source.replace(`/${locale}`, "")}`
        : `${source}`;

    const { compile } = require("path-to-regexp");
    const toUrl = compile(finalSource);
    finalSource = toUrl(params);

    return finalSource;
  } catch (error) {
    throw new Error(
      `Url creation failed by provided
        name: ${name}
        locale: ${locale}
        params: ${JSON.stringify(params)}`
    );
  }
};

const handler = (routeChange, name, as, options = {}) => {
  const translatedUrl = createUrl(name, options.locale, options.params);
  const args = [translatedUrl, as || translatedUrl];

  if (options) {
    args.push({ locale: false, ...options });
  }

  routeChange(...args);
};

const RouterAdapter = ({ push, replace, prefetch, locale, ...rest }) => ({
  ...rest,
  locale,
  createUrl,
  getActiveRoute,
  routes: getPluginConfig().routes,
  asPathWithLocale: `/${locale}${rest.asPath}`,
  prefetch: (name, as) => handler(prefetch, name, as, null),
  push: (name, as, opts) => handler(push, name, as, { locale, ...opts }),
  replace: (name, as, opts) => handler(replace, name, as, { locale, ...opts }),
});

export default RouterAdapter;
