import getConfig from "next/config";
import { compile } from "path-to-regexp";

const isServer = () => typeof window === "undefined";

const getPluginConfig = () => {
  const { publicRuntimeConfig } = getConfig();

  return JSON.parse(publicRuntimeConfig.nextI18nRoutes);
};

/**
 * Find the route by provided `pathname`
 */
const getRoute = (pathname) => {
  const { routes } = getPluginConfig();

  try {
    return Object.values(routes).find((route) => route.pathname === pathname);
  } catch (error) {
    throw new Error(`Route couldn't find by provided pathname: ${pathname}`);
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

  const router = require("next/router").default;
  const activeRoute = getRoute(pathname || router.pathname, router.locale);

  return {
    ...activeRoute,
    ...activeRoute.alternates[router.locale],
  };
};

/**
 * Create url according to given `name`, `locale` and `params`
 * `name` arg should be findable inside i18n-routes.json file
 */
const createUrl = (name, locale, params) => {
  try {
    const { routes, options } = getPluginConfig();

    const { source } = routes[name].alternates[locale];

    let finalSource =
      locale === options.defaultLocale && options.hideDefaultLocalePrefix
        ? `${source.replace(`/${locale}`, "")}`
        : `${source}`;

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
