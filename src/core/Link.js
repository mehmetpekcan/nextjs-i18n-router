import { useMemo } from "react";
import NextLink from "next/link";

import useRouter from "./useRouter";

const Link = ({ name, locale, params, ...props }) => {
  const router = useRouter();
  const translatedUrl = useMemo(
    () => router.createUrl(name, locale || router.locale, params),
    [name, locale, params]
  );

  return (
    <NextLink
      {...props}
      href={translatedUrl}
      as={props.as || translatedUrl}
      locale={false}
    />
  );
};

export default Link;
