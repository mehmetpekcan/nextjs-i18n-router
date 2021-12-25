import { useRouter as useNextRouter } from "next/router";

import RouterAdapter from "./RouterAdapter";

const useRouter = () => {
  const router = useNextRouter();

  return RouterAdapter(router);
};

export default useRouter;
