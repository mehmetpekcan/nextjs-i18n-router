import { compile } from "path-to-regexp";

const createUrl = (name, locale, params) => {
  try {
    const routes = JSON.parse(process.env.NEXT_PUBLIC_I18N_ROUTES);
    const options = JSON.parse(process.env.NEXT_PUBLIC_ROUTER_OPTIONS);

    const { source } = routes[`${locale}_${name}`];

    let finalSource =
      locale === options.defaultLocale && options.hideDefaultLocalePrefix
        ? `${source.replace(`/${locale}`, "")}`
        : `${source}`;

    const pathGenerator = compile(finalSource);

    if (params) {
      finalSource = pathGenerator(params);

      // TODO: check for remaining params if there is they should be quires
    }

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

const routerAdapter = ({
  push,
  replace,
  prefetch,
  locale,
  asPath,
  ...rest
}) => ({
  locale,
  asPath: `/${locale}${asPath}`,
  prefetch: (name, as) => handler(prefetch, name, as, null),
  push: (name, as, opts) => handler(push, name, as, { locale, ...opts }),
  replace: (name, as, opts) => handler(replace, name, as, { locale, ...opts }),
  ...rest,
});

export { createUrl, routerAdapter };
