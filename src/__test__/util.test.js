import { jest } from "@jest/globals";

import mockRoutes from "./mocks/routes.json";

describe("Create url", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {
      ...OLD_ENV,
      NEXT_PUBLIC_I18N_ROUTES: JSON.stringify(mockRoutes),
    };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe("When no parameter given in pathname", () => {
    it("Should create url without parameters", () => {});
  });

  describe("When parameter given in pathname", () => {
    it("Should create url with given parameters", () => {});
    it("Should create url with given parameters have one or more regex", () => {});

    it("Should create url with given parameters have zero or more regex", () => {});
  });

  describe("When parameter and query given in pathname", () => {
    it("Should create url with given parameters and queries", () => {});
  });

  describe("When hide default locale prefix is true", () => {
    it("Should create url without prefix when default locale is given", () => {});
  });
});
