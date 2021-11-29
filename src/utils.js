import { compile } from "path-to-regexp";

const getRoute = (route) =>
  JSON.parse(process.env.NEXT_PUBLIC_I18N_ROUTES)[route];

const generateUrl = (name, locale, params) => {
  try {
    const { source } = getRoute(`${locale}_${name}`);
    let finalSource = `${source}`;

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

export function pushWithI18n(router, name, as, options = {}) {
  // router.push("/", "/ahmet");

  console.log(
    "pushWithI18n",
    generateUrl(name, options.locale || router.locale, options.params)
  );
}

export function replaceWithiI18n(router, name, as, options = {}) {
  // router.push("/", "/ahmet");

  console.log(
    "replaceWithiI18n",
    generateUrl(name, options.locale || router.locale, options.params)
  );
}
