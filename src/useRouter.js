import { useRouter as useNextRouter } from "next/router";

import { routerAdapter } from "./helpers";

const useRouter = () => {
  const router = useNextRouter();

  return routerAdapter(router);
};

export default useRouter;
