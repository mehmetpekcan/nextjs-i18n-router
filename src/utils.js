import { compile } from "path-to-regexp";

export const createUrl = (name, locale, params) => {
  try {
    const options = JSON.parse(process.env.NEXT_PUBLIC_ROUTER_OPTIONS);
    const routes = JSON.parse(process.env.NEXT_PUBLIC_I18N_ROUTES);

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

export function pushWithI18n(push, name, as, options = {}) {
  const translatedUrl = createUrl(name, options.locale, options.params);

  push(translatedUrl, as || translatedUrl, { locale: options.locale || false });
}

export function replaceWithI18n(replace, name, as, options = {}) {
  const translatedUrl = createUrl(name, options.locale, options.params);

  replace(translatedUrl, as || translatedUrl, {
    locale: options.locale || false,
  });
}
