import Router from "next/router";
import { pushWithI18n, replaceWithiI18n } from "./utils";

class I18nRouter {
  constructor() {
    this.router = Router;
    this.routes = JSON.parse(process.env.NEXT_PUBLIC_I18N_ROUTES);
    this.time = new Date().getTime();

    console.log(this.routes);
  }

  push(name, options = {}) {
    pushWithI18n(this.router, name, options);
  }

  replace(name, options = {}) {
    replaceWithiI18n(this.router, name, options);
  }

  getTime() {
    return this.time;
  }
}

export default new I18nRouter();
