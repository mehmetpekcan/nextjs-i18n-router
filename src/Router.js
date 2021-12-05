import nextRouter from "next/router";

import { routerAdapter } from "./helpers";

const Router = () => routerAdapter(nextRouter);

export default Router;
