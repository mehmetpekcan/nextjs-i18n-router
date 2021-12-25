import nextRouter from "next/router";

import RouterAdapter from "./RouterAdapter";

const Router = () => RouterAdapter(nextRouter);

export default Router;
