function pushWithI18n(router, name, options = {}) {
  // router.push("/", "/ahmet");

  console.log("pushWithI18n", router.getTime());
}

function replaceWithiI18n(router, name, options = {}) {
  // router.push("/", "/ahmet");

  console.log("replaceWithiI18n", router.getTime());
}

module.exports = {
  pushWithI18n,
  replaceWithiI18n,
};
