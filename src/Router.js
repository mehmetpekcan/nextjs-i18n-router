import React from "react";
import nextRouter, { useRouter as useNextRouter } from "next/router";
import { compile } from "path-to-regexp";

const createUrl = (name, locale, params) => {
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

const pushWithI18n = (push, name, as, options = {}) => {
  const translatedUrl = createUrl(name, options.locale, options.params);

  push(translatedUrl, as || translatedUrl, { locale: options.locale || false });
};

const replaceWithI18n = (replace, name, as, options = {}) => {
  const translatedUrl = createUrl(name, options.locale, options.params);

  replace(translatedUrl, as || translatedUrl, {
    locale: options.locale || false,
  });
};

const routerAdapter = ({ push, replace, prefetch, locale, ...rest }) => ({
  push: (name, as, options) =>
    pushWithI18n(push, name, as, { locale, ...options }),
  replace: (name, as, options) =>
    replaceWithI18n(replace, name, as, { locale, ...options }),
  // TODO: create custom prefetch
  locale,
  ...rest,
});

const useRouter = () => {
  const router = useNextRouter();

  return routerAdapter(router);
};

const router = () => {
  const i18nRouter = nextRouter;

  return routerAdapter(i18nRouter);
};

export { createUrl, useRouter, router };
