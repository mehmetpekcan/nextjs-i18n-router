import nextRouter from "next/router";

import RouterAdapter from "./RouterAdapter";

const Router = () => RouterAdapter(nextRouter.router);

export default Router;
