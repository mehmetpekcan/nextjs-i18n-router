import nextRouter from "next/router";

import { routerAdapter } from "./helpers";

const router = () => routerAdapter(nextRouter);

export default router;
