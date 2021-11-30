import React from "react";
import { useRouter } from "next/router";

import { replaceWithI18n, pushWithI18n } from "./utils";

const routerAdapter = ({ push, replace, prefetch, locale, ...rest }) => ({
  push: (name, as, options) =>
    pushWithI18n(push, name, as, { locale, ...options }),
  replace: (name, as, options) =>
    replaceWithI18n(replace, name, as, { locale, ...options }),
  // TODO: create custom prefetch
  locale,
  ...rest,
});

const usei18nRouter = () => {
  const router = useRouter();

  return routerAdapter(router);
};

export default usei18nRouter;
