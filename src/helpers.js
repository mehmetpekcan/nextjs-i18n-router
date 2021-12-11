import { compile } from "path-to-regexp";

const findRouteByPathname = (pathname) => {
  const routes = JSON.parse(process.env.NEXT_PUBLIC_I18N_ROUTES);

  try {
    return Object.values(routes).find((route) => route.pathname === pathname);
  } catch (error) {
    throw new Error(`Route couldn't find by provided pathname: ${pathname}`);
  }
};

const getActiveRoute = (pathname) => {
  const isServer = typeof window === "undefined";

  if (isServer && !pathname) {
    throw new Error("Please provide pathname on Server Side");
  }

  const router = require("next/router").default;

  return findRouteByPathname(pathname || router.pathname);
};

const createUrl = (name, locale, params) => {
  try {
    const routes = JSON.parse(process.env.NEXT_PUBLIC_I18N_ROUTES);
    const options = JSON.parse(process.env.NEXT_PUBLIC_ROUTER_OPTIONS);

    const { source } = routes[`${locale}_${name}`];

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
  locale,
  asWithLocale: `${locale}${rest.as}`,
  prefetch: (name, as) => handler(prefetch, name, as, null),
  push: (name, as, opts) => handler(push, name, as, { locale, ...opts }),
  replace: (name, as, opts) => handler(replace, name, as, { locale, ...opts }),
  getActiveRoute,
  ...rest,
});

export { createUrl, routerAdapter };
