import React from "react";
import Router from "./Router";

import { replaceWithiI18n, pushWithI18n } from "./utils";

function usei18nRouter() {
  const router = Router;

  router.push = (name, options) => pushWithI18n(router, name, options);
  router.replace = (name, options) => replaceWithiI18n(router, name, options);

  return router;
}

export default usei18nRouter;
