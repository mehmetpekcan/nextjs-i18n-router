import { compile } from "path-to-regexp";

const isServer = () => typeof window === "undefined";
const getRoutes = () => JSON.parse(process.env.NEXT_PUBLIC_I18N_ROUTES);
const getOptions = () => JSON.parse(process.env.NEXT_PUBLIC_ROUTER_OPTIONS);

/**
 * Find the route by provided `pathname`
 */
const findRouteByPathname = (pathname) => {
  const routes = getRoutes();

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

  return findRouteByPathname(pathname || router.pathname, router.locale);
};

const createUrl = (name, locale, params) => {
  try {
    const routes = getRoutes();
    const options = getOptions();

    const { source } = routes[name].alternates[locale];

    let finalSource =
      locale === options.defaultLocale && options.hideDefaultLocalePrefix
        ? `${source.replace(`/${locale}`, "")}`
        : `${source}`;

    const toUrl = compile(finalSource);
    finalSource = toUrl(params);

    return finalSource;
  } catch (error) {
    return "/";
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

const routerAdapter = ({ push, replace, prefetch, locale, ...rest }) => ({
  ...rest,
  locale,
  getActiveRoute,
  routes: getRoutes(),
  asWithLocale: `${locale}${rest.as}`,
  prefetch: (name, as) => handler(prefetch, name, as, null),
  push: (name, as, opts) => handler(push, name, as, { locale, ...opts }),
  replace: (name, as, opts) => handler(replace, name, as, { locale, ...opts }),
});

export { createUrl, routerAdapter };
