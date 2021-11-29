import React from "react";
import Router from "./Router";

import { replaceWithiI18n, pushWithI18n } from "./utils";

function usei18nRouter() {
  const router = Router;

  router.push = (name, as, options) => pushWithI18n(router, name, as, options);
  router.replace = (name, as, options) =>
    replaceWithiI18n(router, name, as, options);

  return router;
}

export default usei18nRouter;
